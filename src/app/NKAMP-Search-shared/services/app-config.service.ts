import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAppConfig } from '../dataModels/IAppConfig';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  // ---------------------------------------------------------------------------------------------------------------------------------- //

  //#region attributes

  private settings: any;
  private _language: string;
  private _deployUrl: string;
  private _isLoaded: boolean;
  configdata: IAppConfig;
  nameurl: string = '';

  //#endregion attributes

  // ---------------------------------------------------------------------------------------------------------------------------------- //
  // tslint:disable-next-line: variable-name
  constructor(private _httpClient: HttpClient, private router: Router) {
    this._language = 'NA';
    this._deployUrl = 'NA';
    this._isLoaded = false;
  }
  // ---------------------------------------------------------------------------------------------------------------------------------- //
  readConfigFile(): Promise<any> {
    const jsonFile = `${this._deployUrl.toLowerCase()}assets/Configuration/AppConfig.json`;
    return this._httpClient.get(jsonFile).toPromise();
  }
  // ---------------------------------------------------------------------------------------------------------------------------------- //
  async load(): Promise<void> {
    await this.readConfigFile()
      .then((response: any) => {
        this.settings = response;
        this.ReadConfig();
      })
      .catch(error => {
      });
  }
  // ---------------------------------------------------------------------------------------------------------------------------------- //

  //#region Properties Implementation

  // ---------------------------------------------------------------------------------------------------------------------------------- //
  get isLoaded(): boolean {
    return this._isLoaded;
  }
  // ---------------------------------------------------------------------------------------------------------------------------------- //
  set deployUrl(dUrl: string) {
    this._deployUrl = dUrl;
  }
  get deployUrl(): string {
    return this._deployUrl;
  }
  // ---------------------------------------------------------------------------------------------------------------------------------- //
  set language(lang: string) {
    this._language = lang;
  }
  get language(): string {
    return this._language;
  }
  // -------------------------------------------------------------------------------------------------------------------------------- //

  //#endregion

  // ---------------------------------------------------------------------------------------------------------------------------------- //
  ReadConfig(url: string = '') {
    this.configdata = {} as IAppConfig;
    try {
      this.configdata.apiUrl = this.settings.Common.apiUrl;
      this._isLoaded = true;
    } catch (error) {
      this._isLoaded = false;
    }
  }
  // ---------------------------------------------------------------------------------------------------------------------------------- //
}
