import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteComponent } from './favorite.component';
import { RouterModule } from '@angular/router';
import { FavoriteItemsComponent } from './favorite-items/favorite-items.component';
import { FavoriteSearchComponent } from './favorite-search/favorite-search.component';
import { FormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
const FavoriteRoutes = [
  { path: '', component: FavoriteComponent }
];
@NgModule({
  declarations: [
    FavoriteComponent,
    FavoriteItemsComponent,
    FavoriteSearchComponent

  ],
  imports: [
    RouterModule.forChild(FavoriteRoutes),
    CommonModule,
    FormsModule,
    NgbModule,
    NgbPaginationModule
  ]
})
export class FavoriteModule { }
