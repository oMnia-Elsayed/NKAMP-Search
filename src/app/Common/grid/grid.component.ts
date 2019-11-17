import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BookDetailsService } from '../../search/services/book-details.service';
import { FavoriteService } from 'src/app/favorite/services/favorite.service';
import { Router, NavigationExtras } from '@angular/router';
import { SearchService } from 'src/app/search/services/search.service';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('book-data') bookData;

  // @Output() exampleOutPut = new EventEmitter<any>();
  currentRate = 8;
  additionalField: any;
  isFav = false;
  favoriteBadge: any;
  favItems;

  constructor(private $bookDetailFav: BookDetailsService, private $messageService: MessageService,
              private favoriteService: FavoriteService, private router: Router, private $searchService: SearchService) {
  }

  ngOnInit() {
    this.additionalField = this.bookData.addtionFieldsInListPage.addtionField
      .filter(x => x.id === '789f356c-dcec-459c-aac4-6196f430d890')[0].insertedData;

    const body = {
      userId: 'albaqer_naseej',
      // pageSize: 5,
      wantedPage: 0
    };

    this.favoriteService.getFavoriteList(body).subscribe(response => {
      if (response !== null) {
        // this.favItems = response;
        // this.favItems = response;
        // response.forEach( item => {
        // });
      } else {
      }
    });
  }

  public onTap() {
    const bdy = {
      searchProfileId: '996ac773-2701-44ec-a377-bd52838de4dc',
      searchKeyWords: [
        {
          primaryItemSourceId: this.bookData.itemSourceId,
          itemIndexId: this.bookData.itemSourceId,
          dataSourceName: 'aruc_index',
          dataSourceId: '783c969a-cebb-4b0c-8a25-f524ec479cfc',
          materialTypeId: 'f1b94474-82df-4e46-b1df-4cbb61aaee85',
          materialTypeName: 'كتب'
        }
      ]
    };
    const navigationExtras: NavigationExtras = {
      queryParams: {
        details: JSON.stringify(bdy)
      }
    };
    this.router.navigate(['book'], navigationExtras);
  }

  addToMyFav(data) {
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

    this.$bookDetailFav.addFavorite(body).subscribe(response => {
      if (response !== null) {
        this.isFav = true;
        // this.isFav = !this.isFav;
      }
    });
    // this.exampleOutPut.emit(data);
    this.$searchService.emitfavBadgeEvent(data);
  }

  showSuccess() { // TODO: read message from configuration/translation file
    setTimeout(() => {
      this.$messageService.add({ severity: 'success', summary: 'رسالة نجاح', detail: 'تم تقديم طلب إستعارة بنجاح', life: 3600000 });
    }, 2000);
  }
  showError() {
    setTimeout(() => {
      this.$messageService.add({ severity: 'error', summary: 'رسالة خطأ', detail: 'لم يتم تقديم طلب إستعارة بشكل صحيح', life: 3600000 });
    }, 2000);
  }

  borrowBook() {
    this.$searchService.borrow(this.bookData).subscribe(data => {
      if (data.id != null) {
        this.showSuccess();
      } else {
        this.showError();
      }
    });
  }
}

