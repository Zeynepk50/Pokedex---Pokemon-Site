import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss']
})
export class PokemonDetailComponent implements OnInit {
  pokemon: Pokemon | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadPokemon(id);
      }
    });
  }

  loadPokemon(id: string): void {
    this.loading = true;
    this.error = null;
    this.pokemonService.getPokemonById(id).subscribe({
      next: (pokemon) => {
        this.pokemon = pokemon;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Pokémon bilgileri yüklenirken bir hata oluştu';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get formattedId(): string {
    return this.pokemon ? `#${String(this.pokemon.id).padStart(3, '0')}` : '';
  }

  get imageUrl(): string {
    if (!this.pokemon) return '';
    return this.pokemon.sprites.other['official-artwork'].front_default
      || this.pokemon.sprites.front_default
      || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/other/official-artwork/${this.pokemon.id}.png`;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return colors[type.toLowerCase()] || '#A8A878';
  }

  getStatColor(value: number): string {
    if (value < 50) return '#ff6b6b';
    if (value < 100) return '#ffa500';
    if (value < 150) return '#ffd700';
    return '#51cf66';
  }
}
