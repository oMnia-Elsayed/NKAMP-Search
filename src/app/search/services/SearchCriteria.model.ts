export interface SearchKeyWordDetails {
   searchKeyWordId: string;
   materialTypeId: string;
   keyWordValue: string;
   searchOperationId: string;
   nextSearchKeyWordWithAnd: boolean;
}

export interface FacetFilter {
  facetId: string;
  facetType: number;
  facetValue: string;
}

export interface KeywWordOrder {
  keywWordId: string;
  keywWordType: number;
  keywWordValue: string;
  isAcendening: boolean;
}

export interface SearchCriteria {
  searchProfileId: string;
  pageSize: number;
  wantedPage: number;
  dataSourcesId: string[];
  searchKeyWords: SearchKeyWordDetails[];
  facetsFilter: FacetFilter[];
  keywWordsOrderBy: KeywWordOrder[];
}
