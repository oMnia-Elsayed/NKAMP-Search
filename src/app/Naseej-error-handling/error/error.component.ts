import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../../NKAMP-Search-shared/services/globals.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  globalService: GlobalsService;
  constructor(private _globSrv: GlobalsService) {
    this.globalService = this._globSrv;
  }

  ngOnInit() {
  }

}
