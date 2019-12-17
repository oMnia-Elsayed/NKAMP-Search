
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { BookDetailsService } from 'src/app/search/services/book-details.service';
// import '../../../assets/js/sosialsharing.js';
import { SearchService } from 'src/app/search/services/search.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { BookActionService } from '../services/book-action.service.js';
import { FavoriteService } from 'src/app/favorite/services/favorite.service';

declare function sharePostToFaceBook(pageUrl: string, postTitle: string, postDescription: string, postImage: string): any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('book-data') bookData;

  @ViewChild('bookTitle') bookTitle: ElementRef;
  additionalField1: any;
  additionalField2: any;
  albumTitle: any;
  selectEl;
  BookModel = {
    title: 'hager',
    disc: '',
    imageURL: ''
  };
  isFav: boolean;
  favItems: [];
  bookId;

  constructor(private $bookDetailFav: BookDetailsService, private $messageService: MessageService,
              private $searchService: SearchService, private $bookAction: BookActionService,
              private $favService: FavoriteService) { }

  ngOnInit() {
    this.isFav = false;
    this.favItems = this.$searchService.favListArray;

    this.additionalField1 = this.bookData.addtionFieldsInListPage.addtionField
      .filter(x => x.id === '789f356c-dcec-459c-aac4-6196f430d890')[0].insertedData;
    this.additionalField2 = this.bookData.addtionFieldsInListPage.addtionField
      .filter(x => x.id === 'd8ccada6-2dae-42c9-8f6b-da06a2736d00')[0].insertedData;

    for (const elFav of this.favItems) {
      // tslint:disable-next-line: no-string-literal
      if (this.bookData.Title === elFav['_source']['itemListPageInformation']['title']) {
        this.isFav = true;
        // tslint:disable-next-line: no-string-literal
        this.bookId = elFav['_id'];
      }
    }
  }

  addToMyFav(data) {
    this.mainAddRemoveMyFav(data);
  }

  mainAddRemoveMyFav(data) {
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

    if (!this.isFav) {
      this.$favService.addFavorite(body).subscribe(response => {
        if (response !== null) {
          // this.$searchService.emitfavBadgeEvent(data);
          this.isFav = true;
        }
      });
    } else {
      const bdy = {
        _id: this.bookId
      };
      this.$favService.removeFavoriteItem(bdy).subscribe(response => {
        this.$searchService.emitfavBadgeEvent(data);
        this.isFav = false;
      });
    }
  }

  sharefacebook() {
    sharePostToFaceBook(location.href, this.BookModel.title, this.BookModel.disc, this.BookModel.imageURL);
  }
  // $('#twitterShare').on('click', function() {
  //
  //   $("#twitterShare").attr("href","https://twitter.com/intent/tweet?url="+location.href+"&amp;text="+albumTitle)
  // });
  shareTwitter() {
    this.albumTitle = this.bookTitle.nativeElement.innerHTML;
    this.selectEl = 'https://twitter.com/intent/tweet?url=' + location.href + '&amp;text=' + this.albumTitle;
  }

  showSuccess() {
    this.$messageService.add({ severity: 'success', summary: 'رسالة نجاح', detail: 'تم تقديم طلب إستعارة بنجاح', life: 3600000 });
  }
  showError() {
    this.$messageService.add({ severity: 'error', summary: 'رسالة خطأ', detail: 'لم يتم تقديم طلب إستعارة بشكل صحيح', life: 3600000 });
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
