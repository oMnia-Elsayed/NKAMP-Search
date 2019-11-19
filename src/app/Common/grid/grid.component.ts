import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BookDetailsService } from '../../search/services/book-details.service';
import { FavoriteService } from 'src/app/favorite/services/favorite.service';
import { Router, NavigationExtras } from '@angular/router';
import { SearchService } from 'src/app/search/services/search.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { BookActionService } from '../services/book-action.service';

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
  favoriteBadge: any;
  favItems: [];
  isFav: boolean;
  constructor(private $bookDetailFav: BookDetailsService, private $messageService: MessageService,
              private favoriteService: FavoriteService, private router: Router, private $searchService: SearchService,
              private $bookAction: BookActionService) {
  }

  ngOnInit() {
    this.isFav = this.$bookAction.isFav;
    this.favItems = this.$searchService.favListArray;
    this.additionalField = this.bookData.addtionFieldsInListPage.addtionField
      .filter(x => x.id === '789f356c-dcec-459c-aac4-6196f430d890')[0].insertedData;
  }

  addToMyFav(data) {
    this.isFav = !this.isFav;
    this.$bookAction.isFav = this.isFav;
    this.$bookAction.mainAddToMyFav(data);
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

