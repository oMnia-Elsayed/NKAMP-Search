import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search.service';
import { GlobalsService } from 'src/app/NKAMP-Search-shared/services/globals.service';
import { ContentChild } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { SearchCriteria } from '../services/SearchCriteria.Model';
import { $ } from 'protractor';
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
  materialTypesFilters: Array<any>;
  materialTypesConfiguration: Array<any>;
  currentMaterialTypeId: string;
  public searchLoading = false; // For search loader

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
    this.currentMaterialTypeId = this.$searchService.searchCriteria.searchKeyWords[0].materialTypeId; // update Current Material ID

    this.$searchService.searchConfiguration$.subscribe(data => {
      if (data !== null) {
        this.searchKeywords = data.SearchKeywords;
        this.materialTypesConfiguration = data.MaterialTypes;
      }
    });

    this.$searchService.results$.subscribe(data => {
      this.searchLoading = false;
      this.itemsArr = [];
      this.materialTypes = [];
      if (data !== null) {
        this.itemsArr = data.items[0];
        if (!Array.isArray(this.itemsArr)) {
          this.itemsArr = [this.itemsArr];
        }

        this.collectionSizeT = Math.round(data.totalNumberOfItems);

        let materialTypesResults = data.materialTypesSearcQueryStatistic.MaterialType;
        if (!Array.isArray(materialTypesResults)) {
          materialTypesResults = [materialTypesResults];
        }
        materialTypesResults.forEach(value => {
          this.materialTypesConfiguration.forEach(materialType => {
            if (value.id === materialType.NameAr) {
              const newEl = { id: materialType.Id, name: value.id, totalItems: value.totalItems };
              if (!this.$searchService.checkItemInArray(newEl, this.materialTypes)) {
                this.materialTypes.push(newEl);
              }
            }
          });
        });
        if (!this.$searchService.materialFilterActive) {
          this.materialTypesFilters = this.materialTypes;
        }
      }
    });
  }

  makeSearchByMaterial(event, materialId): void {
    this.searchLoading = true;
    this.$searchService.materialFilterActive = true; // active material type tabs filter
    /***********/
    this.$searchService.searchCriteria.searchKeyWords[0].materialTypeId = this.currentMaterialTypeId = materialId;
    this.CriteriaSearch = this.$searchService.searchCriteria;
    this.$searchService.getResults(this.CriteriaSearch).subscribe(data => {
      this.searchLoading = false;
      if (data === 'nodatafound') {
        console.log('Something bad happened; please try again later.');
      } else {
        this.$searchService.results$.next(data);
      }
    });
  }

  paginate(pageNumber): void {
    this.searchLoading = true;
    // this.$searchService.nextPageCriteria.wantedPage = pageNumber - 1;
    this.$searchService.searchCriteria.wantedPage = pageNumber - 1;
    this.CriteriaSearch = this.$searchService.searchCriteria;
    this.getNextPageResults();
  }

  getNextPageResults(): void {
    this.$searchService.getResults(this.CriteriaSearch).subscribe(data => {
      this.searchLoading = false;
      if (data === 'nodatafound') {
        console.log('Something bad happened; please try again later.');
      } else {
        this.$searchService.results$.next(data);
      }
    });
  }

  onChangeSort(searchKeywordId): void {
    this.$searchService.nextPageCriteria.keywWordsOrderBy = searchKeywordId.target.value;
    this.$searchService.nextPageCriteria.wantedPage = 1;
    // this.getNextPageResults();
  }

  onChangePageSize(event): void {
    this.searchLoading = true;
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
