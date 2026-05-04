import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Pokemon } from '../../models/pokemon.model';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;

  constructor(
    private router: Router,
    private favoritesService: FavoritesService
  ) { }

  isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.pokemon.id);
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation(); // Don't trigger card click
    this.favoritesService.toggleFavorite(this.pokemon.id);
  }

  get formattedId(): string {
    return `#${String(this.pokemon.id).padStart(3, '0')}`;
  }

  get imageUrl(): string {
    return this.pokemon.sprites.other['official-artwork'].front_default
      || this.pokemon.sprites.front_default
      || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/other/official-artwork/${this.pokemon.id}.png`;
  }

  get primaryType(): string {  //hover geçişleri için 
    return this.pokemon.types && this.pokemon.types.length > 0   //pokemonun tipini alıyor  
      ? this.pokemon.types[0].type.name
      : 'normal';
  }

  viewDetails(): void {
    this.router.navigate(['/pokemon', this.pokemon.id]);
  }
}
