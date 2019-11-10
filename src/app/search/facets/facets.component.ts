import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search.service';
import { GlobalsService } from 'src/app/NKAMP-Search-shared/services/globals.service';

@Component({
  selector: 'app-facets',
  templateUrl: './facets.component.html',
  styleUrls: ['./facets.component.scss']
})
export class FacetsComponent implements OnInit {
  public facetsArr: Array<any>;
  facetFieldsOptions: Array<any>;
  constructor(private $searchService: SearchService, private $globalsService: GlobalsService) {
    this.facetsArr = [];
    this.facetFieldsOptions = [];
  }

  ngOnInit() {
    this.$searchService.searchConfiguration$.subscribe(data => {
      if (data != null) {
        data.FacetFields.forEach(element => {
          this.facetFieldsOptions.push(element);
        });
      }
    });
    this.$searchService.results$.subscribe(results => {
      if (results !== null) {
        this.facetsArr = results.facetsSearchQueryStatistic;
        this.facetFieldsOptions.forEach((facetOption, idx) => {
          facetOption.values = this.facetsArr.filter(value => {
            return value.facetId === facetOption.id;
          });
          facetOption.values = facetOption.values.map((obj, i) => {
            obj.facetValue = obj.facetValue;
            return obj;
          });
        });
        this.facetFieldsOptions.sort((a, b) => (a.DisplayOrderNumber > b.DisplayOrderNumber) ? 1 : -1);
      }
    });

  }
}
