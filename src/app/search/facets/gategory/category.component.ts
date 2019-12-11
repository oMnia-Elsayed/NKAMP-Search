import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { GlobalsService } from 'src/app/NKAMP-Search-shared/services/globals.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  lang: string;
  categoryForm: FormGroup;
  masterSelected: boolean;
  checklist: Array<any>;
  checkedList: any;
  showAll = false;
  maxShowing = 6;
  totalOfAllItems = 0;

  applyFlag = false;
  isCollapsed = false;
  isVituailizationActive = false;
  config = {
    isAllowMultiSelection: false,
    isPiChart: false,
    isVituailization: false,
  };
  chartData = {
    labels: [],
    data: []
  };
  data: any;
  // variables for radio button
  radioSel: any;
  radioSelected: string;
  radioSelectedString: string;
  // tslint:disable-next-line:no-input-rename
  @Input('facetOption') facetOption;

  constructor(private $searchService: SearchService, private $globalsService: GlobalsService, private $formBuilder: FormBuilder) {
    this.lang = this.$globalsService.UILanguage;
    this.masterSelected = false;
    this.checklist = [];
    this.getCheckedItemList();
  }

  ngOnInit() {

    this.facetOption.values.forEach((o, i) => {
      this.checklist.push({ id: o.facetId, value: o.facetValue, isSelected: false, totalItems: o.totalItems });
    });
    this.facetOption.values.forEach(element => {
      this.totalOfAllItems += element.totalItems;
      this.chartData.labels.push(element.facetValue);
      this.chartData.data.push(element.totalItems);
    });
    this.config.isAllowMultiSelection = !this.facetOption.isAllowMultipeSelection;
    this.config.isPiChart = this.facetOption.isShowPiChart;
    this.config.isVituailization = this.facetOption.isShowVituailization;

    this.data = {
      labels: [...this.chartData.labels],
      datasets: [
        {
          data: [...this.chartData.data],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ]
        }]
    };

    this.$searchService.currentCriteria$.subscribe(data => {
      if (this.$searchService.isFacetFilterDeleted) {
        this.checklist.forEach( el => {
            if (el.value === this.$searchService.deletedFacetFilter.facetValue) {
              el.isSelected = false;
            }
        });
      }
      if (this.$searchService.clearFacetFilters) {
        this.checklist.forEach(el => el.isSelected = false);
      }
    });
  }

  // createItemsFormDynamic() {
  //   this.categoryForm = this.$formBuilder.group({
  //     selectAll: [null],
  //     facetFC: new FormArray([])
  //   });

  //   this.addFacets();
  // }

  // private addFacets() {
  //   this.facetOption.values.map((obj, i) => {
  //     this.checklist.push({ id: obj.id, value: obj.facetValue, isSelected: false });
  //     const control = new FormControl(); // if first item set to true, else false
  //     (this.categoryForm.controls.facetFC as FormArray).push(control);
  //   });
  //   this.getCheckedItemList();
  // }

  checkUncheckAll() {
    for (const item of this.checklist) {
      item.isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.applyFlag = true;
    this.masterSelected = this.checklist.every((item: any) => {
      return item.isSelected === true;
    });
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedList = [];
    for (const item of this.checklist) {
      if (item.isSelected) {
        const selectedItem = {
          facetId: '',
          facetType: '',
          facetValue: ''
        };
        selectedItem.facetId = item.id;
        selectedItem.facetType = item.value;
        selectedItem.facetValue = item.value;
        this.checkedList.push(selectedItem);
      }
    }
  }

  onItemChange(item: any) {
    const selectedItem = {
      facetId: '',
      facetType: '',
      facetValue: ''
    };
    selectedItem.facetId = item.id;
    selectedItem.facetType = item.value;
    selectedItem.facetValue = item.value;
    this.checkedList = [selectedItem];
  }


  onSubmit(): void {
    this.$searchService.materialFilterActive = false; // disable material type tabs filter
    let criteria;
    this.$searchService.currentCriteria$.subscribe(data => {
      criteria = data;
    });
    if (criteria.facetsFilter === undefined) { criteria.facetsFilter = []; }

    this.checkedList.forEach(element => {
      const el = element;
      if (!this.$searchService.checkItemInArray(el, criteria.facetsFilter)) {
        criteria.facetsFilter.push(el);
      }
    });
    this.$searchService.currentCriteria$.next(criteria);
    this.$searchService.getResults(criteria).subscribe((data) => {
      if (data === 'nodatafound') {
        console.log('Something bad happened; please try again later.');
      } else {
        this.$searchService.results$.next(data);
      }
    });
    this.applyFlag = false;
  }
}
