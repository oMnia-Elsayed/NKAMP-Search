import { Injectable } from '@angular/core';
import { LogPublishersService } from './log-publishers.service';
import { LogLevel } from '../dataModel/enums';
import { LogEntry } from '../dataModel/logEntry';
import { LogPublisher } from '../dataModel/ILogPublisher';
import { GlobalsService } from '../../NKAMP-Search-shared/services/globals.service';
// ---------------------------------------------------------------------------------------------------------------------------------- //
@Injectable({
  providedIn: 'root'
})
// ---------------------------------------------------------------------------------------------------------------------------------- //
export class ErrorLoggingService {
// ---------------------------------------------------------------------------------------------------------------------------------- //
  constructor(private publishersService: LogPublishersService, private globalService: GlobalsService) {
    // Set all the publishers into the local array
    this.publishers = this.publishersService.publishers;
  }
// ---------------------------------------------------------------------------------------------------------------------------------- //
  // Public properties
  level: LogLevel = LogLevel.All;
  logWithDate: boolean = true;
  publishers: LogPublisher[];
// ---------------------------------------------------------------------------------------------------------------------------------- //
  private shouldLog(level: LogLevel) : boolean {
    let ret: boolean = false;
    if(this.level !== LogLevel.Off && level >= this.level) {
      ret = true;
    }
    return ret;
  }
// ---------------------------------------------------------------------------------------------------------------------------------- //
  debug(operation: string, msg: string, ...optionalParams: any[]) {
    this.logError(operation, msg, LogLevel.Debug, optionalParams);
  }
// ---------------------------------------------------------------------------------------------------------------------------------- //
  info(operation: string, msg: string, ...optionalParams: any[]) {
    this.logError(operation, msg, LogLevel.Info, optionalParams);
  }
// ---------------------------------------------------------------------------------------------------------------------------------- //
  warn(operation: string, msg: string, ...optionalParams: any[]) {
    this.logError(operation, msg, LogLevel.Warn, optionalParams);
  }
// ---------------------------------------------------------------------------------------------------------------------------------- //
  error(operation: string, msg: string, ...optionalParams: any[]) {
    this.logError(operation, msg, LogLevel.Error, optionalParams);
  }
// ---------------------------------------------------------------------------------------------------------------------------------- //
  fatal(operation: string, msg: string, ...optionalParams: any[]) {
    this.logError(operation, msg, LogLevel.Fatal, optionalParams);
  }
// ---------------------------------------------------------------------------------------------------------------------------------- //
  log(operation: string, msg: any, ...optionalParams: any[]) {
    this.logError(operation, msg, LogLevel.All, optionalParams);
  }
// ---------------------------------------------------------------------------------------------------------------------------------- //
  clear() : void {
    for(let logger of this.publishers) {
      logger.clear();
    }
  }
// ---------------------------------------------------------------------------------------------------------------------------------- //
  private logError(operation: string, msg: string, level: LogLevel, params: any[]) {
    if(this.shouldLog(level)) {
      let entry: LogEntry = new LogEntry();
      entry.operation = operation;
      entry.message = msg;
      entry.level = level;
      entry.extraInfo = params;
      entry.logWithDate = this.logWithDate;
      this.globalService.ErrorRaised = new Error(msg);
      // Log the value to all publishers
      for (let logger of this.publishers) {
        logger.log(entry).subscribe(
          retValue => { if (!retValue) throw new Error(entry.message); },
          errValue => { throw new Error(errValue.message); }
        );
      }
    };
  }
// ---------------------------------------------------------------------------------------------------------------------------------- //
}
