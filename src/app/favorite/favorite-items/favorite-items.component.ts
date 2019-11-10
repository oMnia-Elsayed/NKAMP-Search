import { Component, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FavoriteService } from '../services/favorite.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favorite-items',
  templateUrl: './favorite-items.component.html',
  styleUrls: ['./favorite-items.component.scss']
})
export class FavoriteItemsComponent implements OnInit, OnDestroy {

  @ViewChild('formEle') formElement: NgForm;
  // tslint:disable-next-line:no-output-rename
  @Output('searchResult') searchedEvent = new EventEmitter<boolean>();
  isSearch = false;
  page = 1;
  pageIndex = 1;
  unSubscribeFavoriteList = new Subscription();
  alldate: any;

  constructor(private favoriteService: FavoriteService) { }

  ngOnInit() {
    this.unSubscribeFavoriteList = this.favoriteService.FavoriteList.subscribe((Data) => {
      this.alldate = Data;
      if (Data !== null) {
        this.isSearch = true;
        this.searchedEvent.emit(this.isSearch);
      } else {
      }
    });
  }
  sendFavorite() {
    // checkboxes
  }
  ngOnDestroy() {
    this.unSubscribeFavoriteList.unsubscribe();
  }

  paginate(event) {
  }
}
