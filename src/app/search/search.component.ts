import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SearchService } from './services/search.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { EventEmitterService } from './services/event-emitter.service';
import { FavoriteService } from '../favorite/services/favorite.service';
import { GlobalsService } from 'src/app/NKAMP-Search-shared/services/globals.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [MessageService]
})
export class SearchComponent implements OnInit {

  @ViewChild('formEle') formElement: NgForm;
  lang: string;
  isLoading = false;
  isSavedSearchDisabled = true;
  favoriteBadge: any;
  isNoData = true;
  clicked = false;
  blockedDocument = true;
  addQueryRequestBody = {
    query_syntax: '',
    query_name: '',
    anonymous: false,
    id: '',
    userId: '',
    email: ''
  };
  getQueryValues = [];
  deleteRequestBody = {
    _id: ''
  };

  constructor(private $searchService: SearchService, private favoriteService: FavoriteService, private $messageService: MessageService,
              private $eventEmitterService: EventEmitterService, private $globalsService: GlobalsService) {
      this.lang = this.$globalsService.UILanguage;
    }

  ngOnInit() {

    this.$searchService.favEventListner().subscribe(info => {
      this.getFavoriteBadge();
    });

    this.addQueryRequestBody.userId = this.$searchService.userProfile.userId;
    this.addQueryRequestBody.email = this.$searchService.userProfile.email;
    this.addQueryRequestBody.anonymous = this.$searchService.userProfile.anonymous;
    this.$searchService.currentCriteria$.subscribe((data) => {
      if (data !== null) {
        this.isSavedSearchDisabled = false;
        // tslint:disable-next-line: quotemark
        this.addQueryRequestBody.query_syntax = JSON.stringify(data).replace(/"/g, "'");
      } else {
      }
    });
    const searchProfile = { SearchProfile_id: this.$searchService.userProfile.searchProfile_id };
    this.$searchService.getSearchConfiguration(searchProfile).subscribe(data => {
      this.blockedDocument = false;
      this.$searchService.searchConfiguration$.next(data);
      // this.isLoading = false;
    });

    this.$searchService.results$.subscribe(data => {
      if (data !== null) {
        this.isNoData = false;
      }
    });
    // save search
    this.getquerySavesearch();
    this.getFavoriteBadge();
  }

  getquerySavesearch() {
    this.getQueryValues = [];
    this.$searchService.getQuery({ userId: this.$searchService.userProfile.userId }).subscribe((data) => {
     if (data != null) {
       if (data.Queries != null) {
         data.Queries.forEach(element => {
           this.getQueryValues.push(element);
         });
       } else {
         data.forEach(element => {
           this.getQueryValues.push(element);
         });
       }
     } else {
     }
   });
  }

  showSuccess() { // TODO: read message from configuration/translation file
    this.$messageService.add({ severity: 'success', summary: 'رسالة صحيحة', detail: 'تم حفظ البيانات بنجاح', life: 3600000 });
  }
  showError() {
    this.$messageService.add({ severity: 'error', summary: 'رسالة خطأ', detail: 'لم يتم حفظ البيانات بشكل صحيح', life: 3600000 });
  }


  ToggleClass() {
    this.clicked = !this.clicked;
    this.formElement.reset();
  }


  getSaveSearchInput() {
    if (this.formElement.value.savedSearchInput) {
      this.addQueryRequestBody.query_name = this.formElement.value.savedSearchInput;
      this.ToggleClass();
      this.showSuccess();
      this.saveSearch();
    } else {
    }
  }

  saveSearch() {
    this.$searchService.addQuery(this.addQueryRequestBody).subscribe((data) => {
      if (data.id != null) {
        this.getquerySavesearch();
      } else {
      }
    });

  }

  onSavedSearchClicked(savedCriteriaObj: string) {
    savedCriteriaObj = savedCriteriaObj.replace(/'/g, '"');
    this.$eventEmitterService.onSavedSearchClick(JSON.parse(savedCriteriaObj));
  }

  deleteSearchItem(currentqueryName, currentQueryId) {
    this.deleteRequestBody._id = currentQueryId;
    this.$searchService.deleteQuery(this.deleteRequestBody).subscribe((data) => {
      if (data.Msg === 'Query successfully removed') {
        this.getQueryValues[0].forEach((currentElement, index) => {
          if (currentElement.query_name === currentqueryName) {
            this.getQueryValues[0].splice(index, 1);
          }
        });
        this.showSuccess();
      } else {
        this.showError();
      }
    });
  }

  getFavoriteBadge() {
    const body = {
      userId: 'albaqer_naseej',
      // pageSize: 5,
      wantedPage: 0
    };

    this.favoriteService.getFavoriteList(body).subscribe( response  => {
      if (response !== null) {
        // this.favoriteBadge = response.hits.total;
      } else {
      }
    });
  }
}
