import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchService } from './search.service';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  invokeSavedSearchFunction = new EventEmitter();
  subsVar: Subscription;
  constructor() { }

  onSavedSearchClick(savedCriteriaObj) {
    this.invokeSavedSearchFunction.emit(savedCriteriaObj);
  }
}
