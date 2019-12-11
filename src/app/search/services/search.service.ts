import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AppConfigService } from 'src/app/NKAMP-Search-shared/services/app-config.service';
import { ErrorLoggingService } from 'src/app/Naseej-error-handling/services/error-logging.service';
import { GlobalsService } from 'src/app/NKAMP-Search-shared/services/globals.service';
import { FacetFilter, SearchCriteria } from './SearchCriteria.Model';
import { FavoriteService } from 'src/app/favorite/services/favorite.service';

@Injectable({
  providedIn: 'root'
})

export class SearchService {
  Url: string;
  public results$ = new BehaviorSubject(null);
  public btnClicked$ = new Subject();
  public searchConfiguration$ = new BehaviorSubject(null);
  public currentCriteria$ = new BehaviorSubject(null);
  public searchCriteria: SearchCriteria;
  public currentFacetsConfiguration: Array<any>;
  public userProfile = {
    searchProfile_id: '996ac773-2701-44ec-a377-bd52838de4dc',
    anonymous: false,
    userId: 'albaqer_naseej',
    email: 'albaqer@aas.com.sa'
  };
  public nextPageCriteria = {
    searchProfileId: '',
    pageSize: 12,
    wantedPage: 0,
    dataSourcesId: [],
    searchKeyWords: [],
    facetsFilter: [],
    keywWordsOrderBy: []
  };

  body = {
    userId: 'albaqer_naseej',
    pageSize: 12,
    wantedPage: 0
  };

  favListArray: [];
  isFacetFilterDeleted = false;
  deletedFacetFilter: FacetFilter;
  clearFacetFilters = false;
  private childClickedEvent = new BehaviorSubject<string>('');

  public materialFilterActive = false; // To check material type tabs filter click

  constructor(private http: HttpClient, appConfig: AppConfigService, public globals: GlobalsService,
              private errorLogging: ErrorLoggingService, private favoriteService: FavoriteService) {
    this.Url = appConfig.configdata.apiUrl;
  }

  getSearchConfiguration(bodyRequest): Observable<any> {
    return this.http.post<any>(this.Url + 'SearchConfiguration', bodyRequest).pipe(
      map((data: any) => {
        return data;
      }),
      catchError((error: Error) => {
        const errParams: any[] = [];
        errParams.push(`API_URL = ${this.Url}`);
        errParams.push(`UILanguage = ${this.globals.UILanguage}`);
        this.errorLogging.error(
          'SearchConfiguration',
          `${error.name} --> ${error.message} --> ${error.stack}` ||
          `${error.name} --> ${error.message}`,
          errParams
        );
        return of([] as any[]);
      })
    );
  }

  getResults(searchCriteria): Observable<any> {
    this.favoriteService.getFavoriteList(this.body).subscribe( res => this.favListArray = res.hits.hits);
    searchCriteria.fromPage = searchCriteria.wantedPage;
    // console.log(JSON.stringify(searchCriteria));

    return this.http.post<any>(this.Url + 'MakeNewSearch', searchCriteria)
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(error: HttpErrorResponse) {
    return ['nodatafound'];
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    alert('Something bad happened; please try again later.');
    return throwError('Something bad happened; please try again later.');
  }

  getNextPage(): Observable<any> {
    this.nextPageCriteria.searchProfileId = this.userProfile.searchProfile_id;
    return this.http.post<any>(this.Url + 'GetNextPageResult', this.nextPageCriteria).pipe(
      map((data: any) => {
        return data;
      }), catchError((error: Error) => {
        const errParams: any[] = [];
        errParams.push(`API_URL = ${this.Url}`);
        errParams.push(`UILanguage = ${this.globals.UILanguage}`);
        this.errorLogging.error(
          'GetNextPageResult',
          `${error.name} --> ${error.message} --> ${error.stack}` ||
          `${error.name} --> ${error.message}`,
          errParams
        );
        return of([] as any[]);
      })
    );
  }

  addQuery(saveSerachCriteria): Observable<any> {
    return this.http.post<any>(this.Url + 'AddQuery', saveSerachCriteria).pipe(
      map((data: any) => {
        return data;
      }), catchError((error: Error) => {
        const errParams: any[] = [];
        errParams.push(`API_URL = ${this.Url}`);
        errParams.push(`UILanguage = ${this.globals.UILanguage}`);
        this.errorLogging.error(
          'MakeNewSearch',
          `${error.name} --> ${error.message} --> ${error.stack}` ||
          `${error.name} --> ${error.message}`,
          errParams
        );
        return of([] as any[]);
      })
    );
  }

  getQuery(getSerachCriteriaData): Observable<any> {
    return this.http.post<any>(this.Url + 'GetQuery', getSerachCriteriaData).pipe(
      map((data: any) => {
        return data;
      }), catchError((error: Error) => {
        const errParams: any[] = [];
        errParams.push(`API_URL = ${this.Url}`);
        errParams.push(`UILanguage = ${this.globals.UILanguage}`);
        this.errorLogging.error(
          'MakeNewSearch',
          `${error.name} --> ${error.message} --> ${error.stack}` ||
          `${error.name} --> ${error.message}`,
          errParams
        );
        return of([] as any[]);
      })
    );
  }

  deleteQuery(deleteSerachCriteriaData): Observable<any> {
    const options = {
      headers: new HttpHeaders({
      }),
      body: deleteSerachCriteriaData
    };
    return this.http.post<any>(this.Url + 'DeleteQuery', deleteSerachCriteriaData).pipe(
      map((data: any) => {
        return data;
      }), catchError((error: Error) => {
        const errParams: any[] = [];
        errParams.push(`API_URL = ${this.Url}`);
        errParams.push(`UILanguage = ${this.globals.UILanguage}`);
        this.errorLogging.error(
          'MakeNewSearch',
          `${error.name} --> ${error.message} --> ${error.stack}` ||
          `${error.name} --> ${error.message}`,
          errParams
        );
        return of([] as any[]);
      })
    );
  }

  borrow(data): Observable<any> {
    const body = {
      userId: this.userProfile.userId,
      anonymous: true,
      email: this.userProfile.email,
      primaryItemSourceId: data.itemSourceId,
      itemIndexId: data.itemSourceId,
      dataSourceName: data.dataSourceName,
      dataSourceId: data.dataSourceId,
      materialTypeId: data.materialTypeId,
      materialTypeName: 'كتب',
      borrowDate: '2019-09-04',
      status: 'approved',
      borrowApprovedBy: 'NKAMP ADMIN TEAM',
    };
    return this.http.post<any>(this.Url + 'BorrowRequest', body);
  }

  emitfavBadgeEvent(msg: any) {
    this.childClickedEvent.next(msg);
  }

  favEventListner() {
    return this.childClickedEvent.asObservable();
  }

  checkItemInArray( obj, array) {
    let exists = false;
    array.forEach(el => {
      if (JSON.stringify(el) === JSON.stringify(obj)) {
        exists = true;
      } else {
        exists = false;
      }
    });
    return exists;
  }

}
