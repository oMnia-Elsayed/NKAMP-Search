import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalsService } from '../../NKAMP-Search-shared/services/globals.service';
import { ErrorLoggingService } from './error-logging.service';
// ---------------------------------------------------------------------------------------------------------------------------------- //
@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(
    private injector: Injector,
    private globalService: GlobalsService
  ) {}
// ---------------------------------------------------------------------------------------------------------------------------------- //
  handleError(error: Error): any {
    const errorLogger = this.injector.get(ErrorLoggingService);
    errorLogger.fatal(error.stack || 'unhandled operation', error.message || error.name || 'undefined error');
    const router = this.injector.get(Router);
    this.globalService.ErrorRaised = error;
    router.navigate(['error']);
  }
// ---------------------------------------------------------------------------------------------------------------------------------- //
}
