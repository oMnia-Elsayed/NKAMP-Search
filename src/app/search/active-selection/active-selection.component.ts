import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-active-selection',
  templateUrl: './active-selection.component.html',
  styleUrls: ['./active-selection.component.scss']
})
export class ActiveSelectionComponent implements OnInit {
  isShowing: boolean;
  facetsObj: any;
  constructor(private $searchService: SearchService) {
    this.isShowing = false;
  }

  ngOnInit() {
    this.$searchService.currentCriteria$.subscribe((data) => {
      if (data !== null) {
        if (data.facetsFilter !== undefined) {
          this.facetsObj = [];
          this.isShowing = true;
          data.facetsFilter.forEach(item => {
            this.facetsObj.push(item);
          });
        }
      }
    });
  }
}
