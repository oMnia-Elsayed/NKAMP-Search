import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SearchService } from '../services/search.service';
import { SearchCriteria } from '../services/SearchCriteria.Model';

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
          this.facetsObj = data.facetsFilter;
        }
      }
    });
  }

  deleteFilter(facetVal) {
    this.$searchService.isFacetFilterDeleted = true;

    const newFacets = [];
    this.facetsObj.forEach(el => {
      if (el.facetValue !== facetVal) {
        newFacets.push(el);
      } else {
        this.$searchService.deletedFacetFilter = el;
      }
    });
    this.facetsObj = newFacets;
    this.resetCriteria();
  }

  clearFacetFilter() {
    this.$searchService.clearFacetFilters = true;
    this.facetsObj = [];
    this.resetCriteria();
  }

  resetCriteria() {
    let criteria = {} as SearchCriteria;
    this.$searchService.currentCriteria$.subscribe(data => {
      criteria = data;
    });
    criteria.facetsFilter = this.facetsObj;
    this.$searchService.currentCriteria$.next(criteria);
    this.$searchService.getResults(criteria).subscribe((data) => {
      this.$searchService.results$.next(data);
    });
  }
}
