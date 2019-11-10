import { Injectable } from "@angular/core";
import { LogPublisher, LogPublisherConfig } from "../dataModel/ILogPublisher";
import {
  LogConsole,
  LogLocalStorage,
  LogWebApi
} from "../dataModel/LogPublisher";
import { HttpClient } from "@angular/common/http";
import { AppConfigService } from "../../NKAMP-Search-shared/services/app-config.service";
// ---------------------------------------------------------------------------------------------------------------------------------- //
@Injectable({
  providedIn: "root"
})
// ---------------------------------------------------------------------------------------------------------------------------------- //
export class LogPublishersService {
  publishers: LogPublisher[] = [];
  publishersJson: string;
  constructor(
    private _httpClient: HttpClient,
    private appConfig: AppConfigService
  ) {
    this.publishersJson = `${
      this.appConfig.deployUrl
    }assets/Configuration/log-publishers.json`;
    this.buildPublishers();
  }
  // ---------------------------------------------------------------------------------------------------------------------------------- //
  getLoggers(): Promise<LogPublisherConfig[]> {
    return this._httpClient
      .get<LogPublisherConfig[]>(this.publishersJson)
      .toPromise();
  }
  // ---------------------------------------------------------------------------------------------------------------------------------- //
  buildPublishers(): void {
    let logPub: LogPublisher;
    this.getLoggers()
      .then(response => {
        for (let pub of response.filter(p => p.isActive)) {
          switch (pub.loggerName.toLowerCase()) {
            case "console":
              logPub = new LogConsole();
              break;
            case "localstorage":
              logPub = new LogLocalStorage();
              break;
            case "webapi":
              logPub = new LogWebApi(this._httpClient);
              break;
          }
          // Set location, if any, of the logging
          logPub.location = pub.loggerLocation;
          // Add publisher to array
          this.publishers.push(logPub);
        }
      })
      .catch(error => {
        this.handleErrors(error);
      });
  }
  // ---------------------------------------------------------------------------------------------------------------------------------- //
  private handleErrors(error: any) {
    let errors: string[] = [];
    let msg: string = "";
    msg = "Status: " + error.status;
    msg += " - Status Text: " + error.statusText;
    // if (error.json()) {
    //   msg += " - Exception Message: " + error.json().exceptionMessage;
    // }
    errors.push(msg);
    console.error("An error occurred", errors);
  }
  // ---------------------------------------------------------------------------------------------------------------------------------- //
}
