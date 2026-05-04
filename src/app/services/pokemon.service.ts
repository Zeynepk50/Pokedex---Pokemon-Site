import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, BehaviorSubject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Pokemon, PokemonBasic, PokemonListResponse } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly BASE_URL = 'https://pokeapi.co/api/v2';
  readonly PAGE_SIZE = 20;

  // Cache: tüm pokémon isimleri bir kez çekilir
  private allPokemonCache: PokemonBasic[] = [];
  private cacheLoaded = false;

  constructor(private http: HttpClient) {}

  // Normal sayfalı yükleme
  getPokemonList(page: number): Observable<{ pokemons: Pokemon[]; total: number }> {
    const offset = (page - 1) * this.PAGE_SIZE;
    return this.http
      .get<PokemonListResponse>(`${this.BASE_URL}/pokemon?limit=${this.PAGE_SIZE}&offset=${offset}`)
      .pipe(
        switchMap((response) => {
          const detailRequests = response.results.map((p: PokemonBasic) =>
            this.http.get<Pokemon>(p.url)
          );
          return forkJoin(detailRequests).pipe(
            map((pokemons) => ({ pokemons, total: response.count }))
          );
        })
      );
  }

  // Tüm listeyi bir kez cache'e al
  getAllPokemonNames(): Observable<PokemonBasic[]> {
    if (this.cacheLoaded) {
      return of(this.allPokemonCache);
    }
    return this.http
      .get<PokemonListResponse>(`${this.BASE_URL}/pokemon?limit=10000&offset=0`)
      .pipe(
        map((res) => res.results),
        tap((list) => {
          this.allPokemonCache = list;
          this.cacheLoaded = true;
        })
      );
  }

  // Tüm tipleri çek
  getTypes(): Observable<{name: string, url: string}[]> {
    return this.http.get<{results: {name: string, url: string}[]}>(`${this.BASE_URL}/type`)
      .pipe(map((res) => res.results));
  }

  // Arama: isim ve tiple filtrele, sonra detayları çek (sayfalı)
  searchPokemon(query: string, type: string, page: number): Observable<{ pokemons: Pokemon[]; total: number }> {
    let baseList$: Observable<PokemonBasic[]>;

    if (type) {
      baseList$ = this.http.get<{pokemon: {pokemon: PokemonBasic}[]}>(`${this.BASE_URL}/type/${type}`)
        .pipe(map(res => res.pokemon.map(p => p.pokemon)));
    } else {
      baseList$ = this.getAllPokemonNames();
    }

    return baseList$.pipe(
      switchMap((all) => {
        const filtered = all.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase().trim())
        );
        const total = filtered.length;
        const start = (page - 1) * this.PAGE_SIZE;
        const pageItems = filtered.slice(start, start + this.PAGE_SIZE);

        if (pageItems.length === 0) {
          return of({ pokemons: [] as Pokemon[], total });
        }

        const detailRequests = pageItems.map((p) =>
          this.http.get<Pokemon>(p.url)
        );
        return forkJoin(detailRequests).pipe(
          map((pokemons) => ({ pokemons, total }))
        );
      })
    );
  }

  // Favorileri çek (sayfalı)
  getFavoritesList(ids: number[], page: number): Observable<{ pokemons: Pokemon[]; total: number }> {
    const total = ids.length;
    const start = (page - 1) * this.PAGE_SIZE;
    const pageIds = ids.slice(start, start + this.PAGE_SIZE);

    if (pageIds.length === 0) {
      return of({ pokemons: [] as Pokemon[], total });
    }

    const detailRequests = pageIds.map((id) =>
      this.http.get<Pokemon>(`${this.BASE_URL}/pokemon/${id}`)
    );
    return forkJoin(detailRequests).pipe(
      map((pokemons) => ({ pokemons, total }))
    );
  }

  extractId(url: string): number {
    const parts = url.split('/').filter(Boolean);
    return parseInt(parts[parts.length - 1]);
  }

  // ID ile Pokemon detaylarını çek
  getPokemonById(id: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.BASE_URL}/pokemon/${id}`);
  }
}
