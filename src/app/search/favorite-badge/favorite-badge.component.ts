import { Component, OnInit } from '@angular/core';
import { FavoriteService } from 'src/app/favorite/services/favorite.service';
import { GlobalsService } from 'src/app/NKAMP-Search-shared/services/globals.service';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-favorite-badge',
  templateUrl: './favorite-badge.component.html',
  styleUrls: ['./favorite-badge.component.scss']
})
export class FavoriteBadgeComponent implements OnInit {

  favoriteBadge;
  lang: string;
  constructor(private favoriteService: FavoriteService, private $globalsService: GlobalsService, private $searchService: SearchService ) {
    this.lang = this.$globalsService.UILanguage;
  }

  ngOnInit() {
    this.favoriteService.getFavoriteList(this.$searchService.body).subscribe(response => {
      if (response !== null) {
        this.favoriteBadge = response.hits.total;
      } else {
      }
    });
  }
}
