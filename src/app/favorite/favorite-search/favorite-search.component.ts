import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FavoriteService } from '../services/favorite.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-favorite-search',
  templateUrl: './favorite-search.component.html',
  styleUrls: ['./favorite-search.component.scss']
})
export class FavoriteSearchComponent implements OnInit {
  @ViewChild('formEle') formElement: NgForm;
  collectionSizeT = Math.round(11);
  // pageSize = 5;
  pageIndex = 1;
  getFavoriteListRequestBody = {
    userId: 'Jv0b2WkB7-mpx-Tip1YF',
    // pageSize: 5,
    wantedPage: 1,
    startDate: 1,
    endDate: 1,
    filterByTitle: 'Compuetr'
  };
  startDate: number;
  endDate: number;
  allData: any;
  page = 1;
  show = false;
  index = 0;
  isAdded = false;
  body = {
    userId: 'albaqer_naseej',
    // pageSize: 5,
    wantedPage: 1
  };
  constructor(private favoriteService: FavoriteService) { }
  ngOnInit() {
    this.getFavorite();
  }

  getFavorite() {
    this.favoriteService.getFavoriteList(this.body).subscribe(response => {
      if (response !== null) {
        this.collectionSizeT = Math.round(response.hits.total);
        this.allData = response;
      } else {
      }
    });
  }

  // getFavoriteList() {
  //   if (this.formElement.value.searchName || this.formElement.value.dateFrom || this.formElement.value.dateTo) {
  //       this.startDate =  Number(Object.values(this.formElement.value.dateFrom).reverse().join(""));
  //       this.endDate =  Number(Object.values(this.formElement.value.dateTo).reverse().join(""));
  //       this.getFavoriteListRequestBody.filterByTitle = this.formElement.value.searchName;
  //       this.getFavoriteListRequestBody.startDate = this.startDate;
  //       this.getFavoriteListRequestBody.endDate = this.endDate;
  //       this.favoriteService.getFavoriteList(this.getFavoriteListRequestBody).subscribe( Data  => {
  //         if(Data !== null){
  //           this.favoriteService.FavoriteList.next(Data);
  //         }
  //         else{
  //         }
  //       });
  //   } else {
  //   }
  // }

  onChangePageSize(event) {
  }

  sendFavorite() { }
  removeFav(id, index, dataitem) {
    const body = {
      _id: id
    };

    this.favoriteService.removeFavoriteItem(body).subscribe(response => {
      if (response !== null) {
        this.getFavorite();
      } else {
      }
    });
  }

  getPublisher(item) {
    // tslint:disable-next-line:max-line-length
    return item._source.itemListPageInformation.addtionslFields.filter(x => x.id === 'd8ccada6-2dae-42c9-8f6b-da06a2736d00')[0].insertedData;
  }

  paginate(pageNumber): void {
    this.favoriteService.nextPageCriteria.wantedPage = pageNumber;
    this.body.wantedPage = pageNumber;
    this.pageIndex = pageNumber;
    this.getNextPageResults();
  }

  getNextPageResults(): void {
    this.favoriteService.getFavoriteList(this.body).subscribe(Data => {
      this.favoriteService.FavoriteList.next(Data);
    });
  }
}
