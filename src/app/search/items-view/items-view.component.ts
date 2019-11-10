import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search.service';
import { GlobalsService } from 'src/app/NKAMP-Search-shared/services/globals.service';
import { ContentChild } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { SearchCriteria } from '../services/SearchCriteria.Model';
@Component({
  selector: 'app-items-view',
  templateUrl: './items-view.component.html',
  styleUrls: ['./items-view.component.scss']
})

export class ItemsViewComponent implements OnInit {
  @ContentChild(NgbPagination) pagination: NgbPagination;

  clicked = false;
  dropClicked = false;
  lang: string;

  genralLoclaizaion = {
    en: 'general',
    ar: 'الكل',
    fr: 'général'
  };

  CriteriaSearch: SearchCriteria;
  pageSize = 12;
  generalTXT: string;
  pageIndex = 1;
  displayMode = 1;
  itemsArr: Array<any>;
  collectionSizeT: any;
  searchKeywords: Array<any>;
  materialTypes: Array<any>;
  materialTypesConfiguration: Array<any>;

  constructor(private $searchService: SearchService, private $globalsService: GlobalsService) {
    this.lang = this.$globalsService.UILanguage;
    this.generalTXT = this.genralLoclaizaion.en;
    this.generalTXT = this.lang === 'ar' || this.lang === 'ar-SA' ? this.genralLoclaizaion.ar : this.generalTXT;
    this.generalTXT = this.lang === 'fr' ? this.genralLoclaizaion.fr : this.generalTXT;
    this.searchKeywords = [];
    this.itemsArr = [];
    this.materialTypes = [];
    this.materialTypesConfiguration = [];
  }

  ngOnInit() {
    this.$searchService.searchConfiguration$.subscribe(data => {
      if (data !== null) {
        this.searchKeywords = data.SearchKeywords;
        this.materialTypesConfiguration = data.MaterialTypes;
      }
    });

    this.$searchService.results$.subscribe(data => {
      this.itemsArr = [];
      this.materialTypes = [];
      if (data !== null) {
        this.itemsArr = data.items[0];
        this.collectionSizeT = Math.round(data.totalNumberOfItems);

        const materialTypesResults = data.materialTypesSearcQueryStatistic.MaterialType;
        if (Array.isArray(materialTypesResults)) {
          materialTypesResults.forEach(value => {
            const myVal = this.materialTypesConfiguration.find(materialType => {
              if (value.name === materialType.NameAr) {
                const newEl = {name: value.name, totalItems: value.totalItems};
                if (!this.checkItemInArray( newEl, this.materialTypes)) {
                  this.materialTypes.push(newEl);
                }
              }
              return materialType;
            });
          });
          // console.log(data);
          // console.log(this.materialTypesConfiguration);
          // console.log(this.materialTypes);
          // console.log(this.itemsArr);

        } else {
          this.materialTypes = [materialTypesResults];
        }
      }
    });
  }

  checkItemInArray( obj, array) {
    let exists = false;
    array.forEach(el => {
      if (JSON.stringify(el) === JSON.stringify(obj)) {
        exists = true;
      } else {
        exists = false;
      }
    });
    return exists;
  }

  paginate(pageNumber): void {
    // this.$searchService.nextPageCriteria.wantedPage = pageNumber - 1;
    this.$searchService.searchCriteria.wantedPage = pageNumber - 1;
    this.CriteriaSearch = this.$searchService.searchCriteria;
    this.getNextPageResults();
  }

  getNextPageResults(): void {
    this.$searchService.getResults(this.CriteriaSearch).subscribe(data => {
      this.$searchService.results$.next(data);
    });
  }

  onChangeSort(searchKeywordId): void {
    this.$searchService.nextPageCriteria.keywWordsOrderBy = searchKeywordId.target.value;
    this.$searchService.nextPageCriteria.wantedPage = 1;
    // this.getNextPageResults();
  }

  onChangePageSize(event): void {
    this.pageSize = Number(event.target.value);
    // this.$searchService.nextPageCriteria.pageSize = pageSize.target.value;
    this.$searchService.searchCriteria.pageSize = this.pageSize ;
    this.CriteriaSearch = this.$searchService.searchCriteria;
    this.getNextPageResults();
  }


  exampleParent($event) {
  }

  onDisplayModeChange(mode: number): void {
    this.displayMode = mode;
  }

  ToggleOpenClass() {
    this.clicked = !this.clicked;
    this.$searchService.btnClicked$.next(this.clicked);
  }
  ToggledropClass() {
    this.dropClicked = !this.dropClicked;
  }
}
