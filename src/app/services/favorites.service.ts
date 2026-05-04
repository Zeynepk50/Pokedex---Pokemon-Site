import { Injectable } from '@angular/core';
import { Pokemon } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites: number[] = [];
  private readonly STORAGE_KEY = 'pokemon_favorites';

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.favorites = JSON.parse(saved);
    }
  }

  getFavorites(): number[] {
    return this.favorites;
  }

  isFavorite(pokemonId: number): boolean {
    return this.favorites.includes(pokemonId);
  }

  toggleFavorite(pokemonId: number): void {
    const index = this.favorites.indexOf(pokemonId);
    if (index > -1) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(pokemonId);
    }
    this.save();
  }

  private save(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favorites));
  }
}
