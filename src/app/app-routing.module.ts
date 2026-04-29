import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonDetailComponent } from './components/pokemon-detail/pokemon-detail.component';

const routes: Routes = [
  { path: '', component: PokemonListComponent },
  { path: 'pokemon/:id', component: PokemonDetailComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
/////PokemonListComponent ve PokemonDetailComponent bileşenlerini içeren rotaları tanımlayan Angular yönlendirme modülü. 
/// Ana sayfa olarak PokemonListComponent atanmış ve detay sayfası için dinamik bir rota oluşturulmuş.
/// Ayrıca, tanımlanmamış rotalar ana sayfaya yönlendiriliyor.