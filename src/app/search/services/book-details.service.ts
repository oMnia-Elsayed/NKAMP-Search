import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppConfigService } from 'src/app/NKAMP-Search-shared/services/app-config.service';
import { ErrorLoggingService } from 'src/app/Naseej-error-handling/services/error-logging.service';
import { GlobalsService } from 'src/app/NKAMP-Search-shared/services/globals.service';
import { SearchService } from '../services/search.service';

@Injectable({
  providedIn: 'root'
})
export class BookDetailsService {
  Url: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer 09c4ac1e-040b-3d38-aa29-4a274c186517' })
  };
  public searchService$: SearchService;
  public commentsList = [
    {
      userId: 'albaqer_naseej',
      commentCreateDate: '04-09-2019',
      commentData: 'تعليق رقم 1'
    },
    {
      userId: 'albaqer_naseej',
      commentCreateDate: '04-09-2019',
      commentData: 'تعليق رقم 2'
    }
  ];

  getCommentsTest() {
    // tslint:disable-next-line:no-unused-expression
    return this.commentsList;
  }


  constructor(private http: HttpClient, appConfig: AppConfigService, public globals: GlobalsService,
              private errorLogging: ErrorLoggingService) {
    this.Url = appConfig.configdata.apiUrl;
  }

  addCommntsTest(comment) {
    this.commentsList.push(
      {
        userId: 'albaqer_naseej',
        commentCreateDate: '04-09-2019',
        commentData: comment
      }
    );
    return this.commentsList;
  }

  GetItemDetails(bodyRequest): Observable<any> {
    return this.http.post<any>(this.Url + 'GetItemDetails', bodyRequest).pipe(
      map((data: any) => {
        return data;
      }),
    );
  }


  getComment(requestBody): Observable<any> {
    return this.http.post<any>(this.Url + 'ItemOperation/GetItemOperationDetails', requestBody, this.httpOptions);
  }

  getBookDetails(requestBody): Observable<any> {
    return this.http.post<any>(this.Url + 'ItemOperation/GetItemOperationDetails', requestBody);
  }

  addFavorite(requestBody): Observable<any> {
    return this.http.post<any>(this.Url + 'AddItemToFavorites', requestBody, this.httpOptions).pipe(
      map((data: any) => {
        return data;
      }),
      catchError((error: Error) => {
        const errParams: any[] = [];
        errParams.push(`API_URL = ${this.Url}`);
        errParams.push(`UILanguage = ${this.globals.UILanguage}`);
        this.errorLogging.error(
          'ItemOperation/GetItemOperationDetails',
          `${error.name} --> ${error.message} --> ${error.stack}` ||
          `${error.name} --> ${error.message}`,
          errParams
        );
        return of([] as any[]);
      })
    );
  }
  addNewComment(requestBody): Observable<any> {
    return this.http.post<any>(this.Url + 'ItemOperation/AddComment', requestBody).pipe(
      map((data: any) => {
        return data;
      }),
      catchError((error: Error) => {
        const errParams: any[] = [];
        errParams.push(`API_URL = ${this.Url}`);
        errParams.push(`UILanguage = ${this.globals.UILanguage}`);
        this.errorLogging.error(
          'ItemOperation/GetItemOperationDetails',
          `${error.name} --> ${error.message} --> ${error.stack}` ||
          `${error.name} --> ${error.message}`,
          errParams
        );
        return of([] as any[]);
      })
    );
  }
  addNewRating(requestBody): Observable<any> {
    return this.http.post<any>(this.Url + 'ItemOperation/RateItem', requestBody).pipe(
      map((data: any) => {

        return data;
      }),
      catchError((error: Error) => {
        const errParams: any[] = [];
        errParams.push(`API_URL = ${this.Url}`);
        errParams.push(`UILanguage = ${this.globals.UILanguage}`);
        this.errorLogging.error(
          'ItemOperation/GetItemOperationDetails',
          `${error.name} --> ${error.message} --> ${error.stack}` ||
          `${error.name} --> ${error.message}`,
          errParams
        );
        return of([] as any[]);
      })
    );
  }
}
