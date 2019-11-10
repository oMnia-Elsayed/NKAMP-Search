import { Component, OnInit } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { BookDetailsService } from '../services/book-details.service';
import { GlobalsService } from 'src/app/NKAMP-Search-shared/services/globals.service';
import { ActivatedRoute } from "@angular/router";


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [NgbRatingConfig]
})
export class DetailsComponent implements OnInit {
  lang: string;
  isOneImage = true;
  slides = [];
  additonalFieldsItems = [];
  bookDetails;
  currentRate: number;
  requestBody: any;
  ratingDegree;
  requestBodyForRating: any;


  constructor(private bookDetailsService: BookDetailsService, private $globalsService: GlobalsService,
              config: NgbRatingConfig, private route: ActivatedRoute) {
    this.lang = this.$globalsService.UILanguage;
    config.readonly = true;

    this.route.queryParams.subscribe(params => {
      const details = params.details;
      this.requestBody = JSON.parse(details);
      this.requestBodyForRating = JSON.stringify(this.requestBody.searchKeyWords[0]);
      //// console.log('test rating view in detail' + this.requestBodyForRating);
      // const rateData =  JSON.stringify(this.requestBody.searchKeyWords);
      // this.requestBodyForRating = rateData;
      // //// console.log('ddddd' + this.requestBodyForRating);

  });
  }
  ngOnInit() {



    const ratingRequestBody = {
      primaryItemSourceId: this.requestBodyForRating.primaryItemSourceId,
      itemIndexId: this.requestBodyForRating.itemIndexId,
      dataSourceName: this.requestBodyForRating.dataSourceName,
      dataSourceId: this.requestBodyForRating.dataSourceId,
      materialTypeId: this.requestBodyForRating.materialTypeId,
      materialTypeName: this.requestBodyForRating.materialTypeName
    };

    this.bookDetailsService.GetItemDetails(this.requestBody).subscribe(data => {
        //// console.log("** data book details **" + JSON.stringify(data));
        this.bookDetails = data;

    });



    this.bookDetailsService.getComment(ratingRequestBody).subscribe(Data  => {
      //// console.log('requestBodyForRating' + ratingRequestBody);
      this.ratingDegree = Data[0].rating_count;
      //// console.log('rating in detail' + this.ratingDegree);
       // //// console.log('requestBodyForRating ' + this.requestBodyForRating);
      this.caculateRating(this.ratingDegree);
    });

  //   this.bookDetailsService.getBookDetails(commentsRequestBody).subscribe(  Data  =>{
  //     if (Data !== null) {
  //       Data.forEach(DataElement => {
  //         this.bookDetails.title = DataElement.title;
  //         this.bookDetails.coverImage = DataElement.coverImage;
  //         this.bookDetails.description = DataElement.description;
  //         this.bookDetails.views_count = DataElement.views_count;
  //         this.slides.push(this.bookDetails.coverImage);
  //         this.caculateRating(DataElement.rating_count);
  //         DataElement.addtionFieldsInDetail.forEach(addtionFieldsElement => {
  //           if (addtionFieldsElement.inputHtmlTypeName == 'image') {
  //             this.isOneImage = false;
  //             this.slides.push(addtionFieldsElement.insertedData);
  //           }
  //           this.additonalFieldsItems.push(addtionFieldsElement);
  //           this.additonalFieldsItems.sort((a, b) => (a.fieldOrderPage > b.fieldOrderPage) ? 1 : -1);
  //         });
  //       });
  //     }
  //     else {
  //       //// console.log('no data');
  //     }
  // });

  }
  addToFavorites(){
    const favoritesRequestBody={
      "userId": "hager18",
      "anonymous": true,
      "email": "abdfg@xyz.comabdfg@xyz.com",
      "itemListPageInformation": {
          "primaryItemSourceId": "src_id_7",
          "itemIndexId": "item_index_id_7",
          "dataSourceName": "data_src_name_sample7",
          "dataSourceId": "data_src_id_7",
          "materialTypeId": "mtrl_type_7",
          "materialTypeName": "matrl_type_name7",
          "title": "item title here7",
          "description": "item  desc here7",
          "coverImage": "http://image-url7.com",
          "addtionslFields": [
              {
                  "id": "VDt7BmoBNpoo7s4ytV8C",
                  "aName": "7????? ?????? ???",
                  "eName": "english name here 7",
                  "fName": "frensh name here 7",
                  "fieldOrderPage": 4,
                  "inputHtmlTypeName": "put content here 7",
                  "insertedData": "data to be inserted here 7"
              }
          ]
      }
    };

    this.bookDetailsService.addFavorite(favoritesRequestBody).subscribe( Data  => {
      if (Data !== null) {
        //// console.log('sucess');
      } else {
        //// console.log('no data');
      }
    });
  }

  caculateRating(ratingList) {
    //// console.log('ratingList' + JSON.stringify(ratingList));
    const totalRating = ratingList.l1Count + ratingList.l2Count + ratingList.l3Count + ratingList.l4Count + ratingList.l5Count;

    // tslint:disable-next-line:max-line-length
    const OverAllRating = ( 1 * ratingList.l1Count + 2 * ratingList.l2Count + 3 * ratingList.l3Count + 4 * ratingList.l4Count + 5 * ratingList.l5Count) / (totalRating);
    //// console.log('OverAllRating' + OverAllRating);
    // this.currentRate = Math.round(OverAllRating);
    // this.currentRate = Math.round(ratingList);
    this.ratingDegree = OverAllRating;
  }



}
