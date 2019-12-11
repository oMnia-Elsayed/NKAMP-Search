import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppConfigService } from 'src/app/NKAMP-Search-shared/services/app-config.service';
import { ErrorLoggingService } from 'src/app/Naseej-error-handling/services/error-logging.service';
import { GlobalsService } from 'src/app/NKAMP-Search-shared/services/globals.service';
import { BookDetailsService } from '../../search/services/book-details.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  FavoriteList = new Subject();
  public nextPageCriteria = {
    pageSize: 12,
    wantedPage: 1,
  };
  Url: string; // = https://10.0.6.154:8245/Search10/1.0.0/ItemOperation/GetItemOperationDetails

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer 09c4ac1e-040b-3d38-aa29-4a274c186517' })
  };

  constructor(private http: HttpClient, appConfig: AppConfigService, public globals: GlobalsService,
              private bookDetailsService: BookDetailsService, private errorLogging: ErrorLoggingService) {
    this.Url = appConfig.configdata.apiUrl;
  }

  getFavoriteList(requestBody): Observable<any> {

    // requestBody.wantedPage = this.nextPageCriteria.wantedPage;
    // return this.http.post<any>(this.Url + 'GetFavoritesList', requestBody, this.bookDetailsService.httpOptions);
    return this.http.post<any>(this.Url + 'GetFavoritesList', requestBody, this.bookDetailsService.httpOptions).pipe(
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

  removeFavoriteItem(requestBody): Observable<any> {
    return this.http.post<any>(this.Url + 'DeleteFavoritesItem', requestBody, this.bookDetailsService.httpOptions).pipe(
      map((data: any) => {
        return data;
      }),
      catchError((error: Error) => {
        const errParams: any[] = [];
        errParams.push(`API_URL = ${this.Url}`);
        errParams.push(`UILanguage = ${this.globals.UILanguage}`);
        this.errorLogging.error(
          'DeleteFavoritesItem',
          `${error.name} --> ${error.message} --> ${error.stack}` ||
          `${error.name} --> ${error.message}`,
          errParams
        );
        return of([] as any[]);
      })
    );
  }
}
