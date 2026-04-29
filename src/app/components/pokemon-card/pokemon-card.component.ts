import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;

  constructor(private router: Router) {}

  get formattedId(): string {
    return `#${String(this.pokemon.id).padStart(3, '0')}`;
  }

  get imageUrl(): string {
    return this.pokemon.sprites.other['official-artwork'].front_default
      || this.pokemon.sprites.front_default
      || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/other/official-artwork/${this.pokemon.id}.png`;
  }

  viewDetails(): void {
    this.router.navigate(['/pokemon', this.pokemon.id]);
  }
}
