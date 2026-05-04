import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {
  pokemons: Pokemon[] = [];
  currentPage = 1;
  totalPages = 0;
  totalCount = 0;
  loading = false;
  error = '';
  searchQuery = '';
  selectedType = '';
  types: { name: string, url: string }[] = [];
  isSearchMode = false;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.loadTypes();
    const savedPage = localStorage.getItem('currentPage'); // kaydettiğim sayfayı bulur
    this.loadPage(savedPage ? parseInt(savedPage, 10) : 1);  // bulduğu sayfayı yükler
  }

  loadTypes(): void {
    this.pokemonService.getTypes().subscribe({
      next: (types) => {
        // Exclude unknown and stellar as they usually don't have pokemons or are not main types
        this.types = types.filter(t => t.name !== 'unknown' && t.name !== 'stellar');
      }
    });
  }

  loadPage(page: number): void {
    this.loading = true;
    this.error = '';
    this.currentPage = page;
    localStorage.setItem('currentPage', page.toString());  //Hangi sayfada olduğumuz tutuluyor. Sayfa yenilenince geri gelmesi için
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (this.isSearchMode && (this.searchQuery || this.selectedType)) {
      this.pokemonService.searchPokemon(this.searchQuery, this.selectedType, page).subscribe({
        next: ({ pokemons, total }) => {
          this.pokemons = pokemons;
          this.totalCount = total;
          this.totalPages = Math.ceil(total / this.pokemonService.PAGE_SIZE);
          this.loading = false;
        },
        error: () => {
          this.error = 'Arama sırasında hata oluştu.';
          this.loading = false;
        }
      });
    } else {
      this.pokemonService.getPokemonList(page).subscribe({
        next: ({ pokemons, total }) => {
          this.pokemons = pokemons;
          this.totalCount = total;
          this.totalPages = Math.ceil(total / this.pokemonService.PAGE_SIZE);
          this.loading = false;
        },
        error: () => {
          this.error = 'Pokémon yüklenirken hata oluştu.';
          this.loading = false;
        }
      });
    }
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.isSearchMode = this.searchQuery.length > 0 || this.selectedType.length > 0;
    this.loadPage(1);
  }

  onTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedType = select.value;
    this.isSearchMode = this.searchQuery.length > 0 || this.selectedType.length > 0;
    this.loadPage(1);
  }

  getTypeColor(type: string): string {   ////////filtre çubuğundaki yazıların renkleri için 
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

  onPageChange(page: number): void {
    this.loadPage(page);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pokemonService.PAGE_SIZE + 1;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.pokemonService.PAGE_SIZE, this.totalCount);
  }
}




// export class PokemonListComponent implements OnInit {
//   pokemons: Pokemon[] = [];


// selectedPokemon: Pokemon | null = null;

// openDetails(pokemon: Pokemon): void {
//   this.selectedPokemon = pokemon;
// }

// closeDetails(): void {
//   this.selectedPokemon = null;
// }
// }