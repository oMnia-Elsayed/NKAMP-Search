import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookDetailsComponent } from './search/book-details/book-details.component';
import { ResultsAreaComponent } from './search/results-area/results-area.component';
import { SearchComponent } from './search/search.component';


const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full'},
  { path: 'search', loadChildren: './search/search.module#SearchModule'},
  { path: 'favorite', loadChildren: './favorite/favorite.module#FavoriteModule'},
  { path: 'digital', loadChildren: './digital-library/digital-library.module#DigitalLibraryModule'},
  { path: 'book', component: BookDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
