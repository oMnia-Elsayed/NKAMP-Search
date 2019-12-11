import { Injectable } from '@angular/core';
import { SearchService } from 'src/app/search/services/search.service';
import { FavoriteService } from 'src/app/favorite/services/favorite.service';

@Injectable({
  providedIn: 'root'
})
export class BookActionService {

  isFav = false;
  constructor(private $favService: FavoriteService, private $searchService: SearchService ) { }

  mainAddRemoveMyFav(data, bookId, isFav) {
    const body = {
      userId: 'albaqer_naseej',
      anonymous: true,
      email: 'albaqer@naseej.com',
      itemListPageInformation: {
        itemSourceId: data.itemSourceId,
        dataSourceName: data.dataSourceName,
        dataSourceId: data.dataSourceId,
        materialTypeId: data.materialTypeId,
        materialTypeName: data.materialTypeName,
        title: data.Title,
        description: data.PhysicalDescription,
        coverImage: data.coverImage,
        addtionslFields: data.addtionFieldsInListPage.addtionField
      }
    };

    if (!isFav) {
      this.$favService.addFavorite(body).subscribe(response => {
        if (response !== null) {
          this.$searchService.emitfavBadgeEvent(data);
          this.isFav = true;
        }

      });
    } else {
      const bdy = {
        _id: bookId
      };

      this.$favService.removeFavoriteItem(bdy).subscribe(response => {
        this.$searchService.emitfavBadgeEvent(data);
        this.isFav = false;
      });
    }
  }
}
