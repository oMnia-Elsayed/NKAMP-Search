import { Injectable } from '@angular/core';
import { SearchService } from 'src/app/search/services/search.service';
import { BookDetailsService } from 'src/app/search/services/book-details.service';

@Injectable({
  providedIn: 'root'
})
export class BookActionService {

  isFav = false;

  constructor(private $bookDetailFav: BookDetailsService, private $searchService: SearchService ) { }

  mainAddToMyFav(data) {
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

    if (this.isFav) {
      this.$bookDetailFav.addFavorite(body).subscribe(response => {
        if (response !== null) {
          this.isFav = false;
          this.$searchService.emitfavBadgeEvent(data);
        }
      });
    }
  }
}
