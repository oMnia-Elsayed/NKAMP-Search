import { Component, OnInit } from '@angular/core';
import { ViewChild, ViewContainerRef, TemplateRef } from '@angular/core';
import { SearchService } from '../services/search.service';
import { Criteria, AllCriteriaSearch, SearchKeyword } from '../services/criteriaModel';
import { SearchCriteria, SearchKeyWordDetails, FacetFilter, KeywWordOrder } from '../services/SearchCriteria.Model';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { GlobalsService } from 'src/app/NKAMP-Search-shared/services/globals.service';
import { EventEmitterService } from '../services/event-emitter.service';

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.scss']
})
export class CriteriaComponent implements OnInit {
  criteriaForm: FormGroup;
  pageSize = 12;
  isAdvanced = false;
  DataSources: Criteria[];
  dataSourceId = '10f05e71-c6d2-4de3-a0df-e910bbb3942b';
  materialTypeId = '7cb61ddc-9927-4b5e-b6b1-0855de3bb75f';
  generalMaterialTypeId = 'f1b94474-82df-4e46-b1df-4cbb61aaee85'; // General Material Type ID used as default search value
  searchOperationId = 'e58fb0bc-744c-4136-a4ce-a9a3736914fe';
  myOperations: Criteria[];
  AllFields: Criteria[];
  ContainsData: Criteria[];
  CriteriaSearch: SearchCriteria;
  AllCriteriaSearch: AllCriteriaSearch;
  lang: string;
  searchKeyword: SearchKeyword[];
  searchKeyWords: SearchKeyWordDetails[];
  facetsFilter: FacetFilter[];
  keywWordsOrderBy: KeywWordOrder[];
  // isActive = false;
  keywords = [];
  kw = '';
  isShown = true;
  searchLoading = false;  // For criteria search loader
  showSearchOperationFC = true;
  kwItem;
  constructor(private $searchService: SearchService, private $globalsService: GlobalsService,
              private $eventEmitterService: EventEmitterService, private fb: FormBuilder) {
    this.lang = this.$globalsService.UILanguage;
    this.inisalizeCriteriaobject();
    this.DataSources = [];
    this.AllFields = [];
    this.ContainsData = [];
    this.searchKeyword = [];
  }

  inisalizeCriteriaobject() {
    this.CriteriaSearch = {} as SearchCriteria;
    this.CriteriaSearch.dataSourcesId = [];
  }

  ngOnInit() {
    this.createFormdynamic();
    this.getAllDataCriteria();
    // make getsaved function accessable to infoke from another component
    if (this.$eventEmitterService.subsVar === undefined) {
      this.$eventEmitterService.subsVar = this.$eventEmitterService.invokeSavedSearchFunction.subscribe((data) => {
        this.getSavedSearch(data);
      });
    }
    // END
  }

  createFormdynamic() {
    this.criteriaForm = this.fb.group({
      dataSourceFC: [],
      searchadd: this.fb.array([this.addSearchFormGroup()])
    });
  }

  addSearchFormGroup(defalutValues = {
    operator: 'AND',
    // facet: '7cb61ddc-9927-4b5e-b6b1-0855de3bb75f',
    facet: null,
    operation: null,
    text: ''
  }) {
    return this.fb.group({
      operator: [defalutValues.operator],
      facetFC: [defalutValues.facet],
      searchOperationFC: [{ value: defalutValues.operation, disabled: false }],
      searchTextFC: [defalutValues.text, Validators.required],
    });
  }

  getAllDataCriteria() {
    this.$searchService.searchConfiguration$.subscribe(data => {
      if (data != null) {
        this.DataSources = data.DataSources;
        this.AllFields = data.FacetFields;
        this.searchKeyword = data.SearchKeywords;
        // fill third dropdown because second dropdown is by default "All Fields"
        this.kwItem = this.searchKeyword.filter(x => x.id === '7cb61ddc-9927-4b5e-b6b1-0855de3bb75f');

        // tslint:disable-next-line: no-string-literal
        this.myOperations = this.kwItem[0]['AllowedSearchOperations']['AllowedSearchOperation'];
      }
    });
  }

  getSavedSearch(savedCriteriaObj) {
    if (savedCriteriaObj != null) {
      // const dataSourceFC = this.criteriaForm.get('dataSourceFC') as FormControl;
      if (savedCriteriaObj.dataSourcesId.length === 1) {
        this.criteriaForm.patchValue({ dataSourceFC: savedCriteriaObj.dataSourcesId[0] });
      }
      const currentCreteriaForms = this.criteriaForm.get('searchadd') as FormArray;
      currentCreteriaForms.controls = [];
      if (savedCriteriaObj.searchKeyWords.length > 1) { this.isAdvanced = true; } else { this.isAdvanced = false; }
      savedCriteriaObj.searchKeyWords.forEach((row, idx) => {
        this.addSearchButtonClick();
        const abstractControl = currentCreteriaForms.controls[idx];
        // const { facetFC, searchTextFC, searchOperationFC, operator } = abstractControl.controls;
        abstractControl.patchValue({
          facetFC: row.searchKeyWordId,
          searchTextFC: row.keyWordValue,
          searchOperationFC: row.searchOperationId,
          operator: (row.nextSearchKeyWordWithAnd ? 'AND' : 'OR')
        });
      });
      this.onSubmit();
    }
  }

  addSearchButtonClick(): void {
    if ((this.criteriaForm.get('searchadd') as FormArray).length < this.searchKeyword.length) {
      (this.criteriaForm.get('searchadd') as FormArray).push(this.addSearchFormGroup());
    }
  }

  //  ----------------------------------------------------------------------------------------------------------------------- //

  onSubmit() {
    this.searchLoading = true;
    this.setSearchObject();
    this.$searchService.materialFilterActive = false; // disable material type tabs filter
    this.$searchService.currentCriteria$.next(this.CriteriaSearch);
    this.$searchService.getResults(this.CriteriaSearch).subscribe((data) => {
      this.searchLoading = false;
      if (data === 'nodatafound') {
        console.log('Something bad happened; please try again later.');
      } else {
        this.$searchService.results$.next(data);
      }
    });
  }

  setSearchObject(group: FormGroup = this.criteriaForm): void {
    this.CriteriaSearch.searchProfileId = this.$searchService.userProfile.searchProfile_id;
    this.CriteriaSearch.pageSize = this.pageSize;
    this.CriteriaSearch.wantedPage = 0;
    this.CriteriaSearch.facetsFilter = this.facetsFilter || [];
    this.CriteriaSearch.keywWordsOrderBy = this.keywWordsOrderBy || [
      {
        keywWordId: '',
        keywWordType: 1,
        keywWordValue: '',
        isAcendening: true
      }
    ];
    this.CriteriaSearch.dataSourcesId = [];
    this.CriteriaSearch.searchKeyWords = [];
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormControl) {
        if (key === 'dataSourceFC') {
          if (abstractControl.value === null) {
            this.CriteriaSearch.dataSourcesId = [];
            this.DataSources.forEach((data) => {
              this.CriteriaSearch.dataSourcesId.push(data.id);
            });
          } else {
            this.CriteriaSearch.dataSourcesId.push(abstractControl.value);
          }
        }
      }
      if (abstractControl instanceof FormArray) {
        abstractControl.controls.forEach((control, controlIdx) => {
          if (control instanceof FormGroup) {
            let searchKeyWord = {} as SearchKeyWordDetails;
            const isLast: boolean = controlIdx === abstractControl.controls.length;
            const { facetFC, searchTextFC, searchOperationFC, operator } = control.value;
            searchKeyWord = {
              searchKeyWordId: (facetFC !== null ? facetFC : 'd112835b-3b56-4295-aa62-7842dee627d0'),
              materialTypeId: this.generalMaterialTypeId,
              keyWordValue: searchTextFC,
              searchOperationId: ((searchOperationFC !== null && searchOperationFC !== undefined) ?
                searchOperationFC : 'aad2c592-dc0d-4ed5-a5c7-6f0259c0498b'),
              nextSearchKeyWordWithAnd: isLast ? null : ((operator === 'AND' ? true : false)),
            };
            this.CriteriaSearch.searchKeyWords.push(searchKeyWord);
          }
        });
      }
    });
    this.$searchService.searchCriteria = this.CriteriaSearch;
  }

  // ---------------------------------------------------------------------------------------------------------------------------- //

  changeDataSourceItem(event) {
    this.dataSourceId = event.target.value.slice(3, event.target.value.length);
  }

  changeFacetFC(event, searchKeyword) {
    const kwId = event.target.selectedOptions[0].id;
    this.kwItem = searchKeyword.filter(x => x.id === kwId);
    this.myOperations = this.kwItem[0].AllowedSearchOperations.AllowedSearchOperation;
    this.materialTypeId = kwId;

    if (this.kwItem[0].id === '7cb61ddc-9927-4b5e-b6b1-0855de3bb75') {
      for (const el of this.myOperations) {
        if (el.id != null) {
          this.showSearchOperationFC = false;
        }
      }
    } else {
      this.showSearchOperationFC = false;
    }
  }

  changeOperationId(event) {
    // console.log(event);
  }

  // ---------------------------------------------------------------------------------------------------------------------------------- //

  removeCurrentRowClick(selected): void {
    const currentCreteriaForms = this.criteriaForm.get('searchadd') as FormArray;
    currentCreteriaForms.removeAt(selected);

  }

  onClickChangeToSimpleSearch() {
    this.isAdvanced = false;
    const currentCreteriaForms = this.criteriaForm.get('searchadd') as FormArray;
    currentCreteriaForms.controls.length = 1;
  }



  /*getContainsData(indexControll) {
    const currentCreteriaForms = this.criteriaForm.get('searchadd') as FormArray;
    const controll = currentCreteriaForms.at(indexControll) as FormGroup;
    const FeildControl = controll.controls.facetFC as FormControl;
    const containControl = controll.controls.searchOperationFC as FormControl;
    if (FeildControl.value !== null) {
      containControl.enable();
      const selectedFacetObj = this.searchKeyword.filter((value, idx) => {
        return value.id === FeildControl.value;
      });
     // return [...selectedFacetObj[0].allowedSearchOperations];
     return [...selectedFacetObj];
    } else {
      containControl.disable();
      return [];
    }

  }*/

}
