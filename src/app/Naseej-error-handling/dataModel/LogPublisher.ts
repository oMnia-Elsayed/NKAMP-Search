
import {throwError as observableThrowError,  Observable, of } from 'rxjs';
import { LogPublisher } from "./ILogPublisher";
import { LogEntry } from "./logEntry";
import { map, catchError } from "rxjs/operators";
import { HttpHeaders, HttpClient } from "@angular/common/http";
// ---------------------------------------------------------------------------------------------------------------------------------- //
export class LogConsole extends LogPublisher {
  log(record: LogEntry): Observable<boolean> {
    // Log to the console
    console.error(record.buildLogString());
    return of(true);
  }
  clear(): Observable<boolean> {
    console.clear();
    return of(true);
  }
}
// ---------------------------------------------------------------------------------------------------------------------------------- //
export class LogLocalStorage extends LogPublisher {
  constructor() {
    super();
    this.location = "logging";
  }

  getAll(): Observable<LogEntry[]> {
    let values: LogEntry[];

    // Retrieve all values from local storage
    values = JSON.parse(localStorage.getItem(this.location)) || [];

    return of(values);
  }

  log(record: LogEntry): Observable<boolean> {
    let ret: boolean = false;
    let values: LogEntry[];

    try {
      values = JSON.parse(localStorage.getItem(this.location)) || [];
      // Add new log entry to the array
      values.push(record);
      // Store the complete array into local storage
      localStorage.setItem(this.location, JSON.stringify(values));
      ret = true;
    } catch (ex) {
      ret = false;
    }

    return of(ret);
  }

  clear(): Observable<boolean> {
    localStorage.removeItem(this.location);
    return of(true);
  }
}
// ---------------------------------------------------------------------------------------------------------------------------------- //
export class LogWebApi extends LogPublisher {
  constructor(private http: HttpClient) {
    super();

    this.location = "http://localhost:56590/api/log";
  }

  log(record: LogEntry): Observable<boolean> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.post(this.location, record, httpOptions).pipe(
      map(response => response),
      catchError(this.handleErrors)
    );
  }

  clear(): Observable<boolean> {
    // TODO: Call Web API to clear all log entries
    return of(true);
  }

  private handleErrors(error: any): Observable<any> {
    let errors: string[] = [];
    let msg: string = "";

    msg = "Status: " + error.status;
    msg += " - Status Text: " + error.statusText;
    // if (error.json()) {
    //   msg += " - Exception Message: " + error.json().exceptionMessage;
    // }

    errors.push(msg);

    console.error("An error occurred", errors);

    return observableThrowError(errors);
  }
}
// ---------------------------------------------------------------------------------------------------------------------------------- //
