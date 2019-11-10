import { Component, OnInit } from '@angular/core';
import { FavoriteService } from 'src/app/favorite/services/favorite.service';
import { GlobalsService } from 'src/app/NKAMP-Search-shared/services/globals.service';

@Component({
  selector: 'app-favorite-badge',
  templateUrl: './favorite-badge.component.html',
  styleUrls: ['./favorite-badge.component.scss']
})
export class FavoriteBadgeComponent implements OnInit {

  favoriteBadge: 55;
  lang: string;
  constructor(private favoriteService: FavoriteService, private $globalsService: GlobalsService) {
    this.lang = this.$globalsService.UILanguage;
  }

  ngOnInit() {
    const body = {
      userId: 'albaqer_naseej',
      // pageSize: 5,
      wantedPage: 0
    };
    this.favoriteService.getFavoriteList(body).subscribe(response => {
      if (response !== null) {
        this.favoriteBadge = response.hits.total;
      } else {
      }
    });
  }
}
