import { Component, OnInit } from '@angular/core';
import { GetApiService } from './../../get-api.service';
import { newArray } from '@angular/compiler/src/util';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})

export class ContentComponent implements OnInit {
  buttonValue: string = '';
  currencyData: any[] = [];
  volumeRow: any;
  dayVol: any;
  priceVol: any;
  volumesAll: any = new Array();
  max: any;
  maxDay: any;
  rowArrPrices: any;
  arrPrices: any = new Array();
  price: any;
  maxDays: any = new Array();
  maxVolumes: any = new Array();
  answerMax: string = '';
  downD: any = new Array();
  prices: any = new Array();
  pricesPerDay: any = new Array();
  downDays: number=0;
  maxDown: any;
  answerDown: string = '';
  item1: any;
  item2: any;
  item3: any;
  rowArr: any;
  dayBest: any;
  dayAllBest = new Array();
  pricesPerDayBest = new Array();
  dayAll = new Array();
  priceAll = new Array();
  minAll = new Array();
  maxAll = new Array();
  minDayB = new Array();
  maxDayB = new Array();
  bestBuyingPrice: any;
  bestBuyingDay: any;
  bestSellingPrice: any;
  bestSellingDay: any;
  answerBestDays: string = '';

  constructor(private api: GetApiService) { }

  ngOnInit() {
    
  }

  getData(dateFrom: any, dateTo: any, button: any): void  {
   
    this.api.apiCall(dateFrom, dateTo).subscribe(data => {
      this.buttonValue = button.id;
      this.currencyData = data;

      if (this.buttonValue === "but1") {
        this.getDownwardDays();
      }

      if (this.buttonValue === "but2") {
        this.getVolumeMax();
      }

      if (this.buttonValue === "but3") {
        this.getBestDays();
      }
    })
  }

  getDownwardDays():void {
    for (var i in this.currencyData) {
      if (i === 'prices') {
        for (var j in this.currencyData[i]) {
          this.rowArrPrices = this.currencyData[i][j];
          this.price = this.rowArrPrices[1];
          this.prices.push(this.price);
        }
      }
    }

    for (let i = 0; i < this.prices.length; i +=23) {
      var item = this.prices[i];
      this.pricesPerDay.push(item);
    }

    let downDays = 0;
    for (let i = 0; i < this.pricesPerDay.length; i++) {
      if (i >= 1) {
        this.item1 = this.pricesPerDay[i];
        this.item2 = this.pricesPerDay[i - 1];
        if (this.item1 < this.item2) {
          downDays++;
          this.downD.push(downDays);
        }
        else{
          if (this.downDays >= 0) {
            this.downD.push(downDays);
            downDays = 0;
          } else {
            this.downD.push(0);
          }
        }
      }
    }
    this.maxDown = Math.max(...this.downD);
    this.answerDown = 'Bitcoins price decreased ' + this.maxDown+' days in a row within a given date range.';
  }

  getVolumeMax():void {
    for (var i in this.currencyData) {
      if (i === 'total_volumes') {
        for (var j in this.currencyData[i]) {
          this.volumeRow = this.currencyData[i][j];
          this.volumesAll.push(this.volumeRow);
        }
      }
    }
    this.findMax();
  }

  findMax():void {
    for (var i in this.volumesAll) {
      for (var j in this.volumesAll[i]) {
        this.volumeRow = this.volumesAll[i]; 
          this.dayVol = this.volumeRow[0];
          this.maxDays.push(this.dayVol);
          this.priceVol = this.volumeRow[1];
          this.maxVolumes.push(this.priceVol);
        }
    }
    this.max = Math.max(...this.maxVolumes);
    var ind = this.maxVolumes.indexOf(this.max);
    this.maxDay = new Date(this.maxDays[ind]).toLocaleDateString("fi-FI");
    this.answerMax = 'The highest trading volume was on ' + this.maxDay + ' and the volume was ' + Math.round(this.max * 100)/100 + ' e. ';
  }

  getBestDays(): void {
    let downward: boolean = false;
    let upward: boolean = false;
    for (var i in this.currencyData) {
      if (i === 'prices') {
        for (var j in this.currencyData[i]) {
          this.rowArr = this.currencyData[i][j];
          this.dayBest = this.rowArr[0];
          this.dayAll.push(this.dayBest);
          this.price = this.rowArr[1];
          this.priceAll.push(this.price);
        }
      }
    }

    for (let i = 0; i < this.priceAll.length; i += 23) {
      var item = this.priceAll[i];
      this.pricesPerDayBest.push(item);
    }

    for (let i = 0; i < this.dayAll.length; i += 23) {
      var item = this.dayAll[i];
      this.dayAllBest.push(item);
    }


    for (let i = 0; i < this.pricesPerDayBest.length; i++) {
      if (i >= 1) {
        this.item1 = this.pricesPerDayBest[i];
        this.item2 = this.pricesPerDayBest[i - 1];
        this.item3 = this.pricesPerDayBest[i + 1];
        if (this.item1 < this.item2 && this.item1 < this.item3) {
          this.minAll.push(this.item1);
          this.minDayB.push(this.dayAllBest[i]);
        }
        else if (this.item1 > this.item2 && this.item1 > this.item3) {
          this.maxAll.push(this.item1);
          this.maxDayB.push(this.dayAllBest[i])
        }

        else if (this.pricesPerDayBest[0] > this.pricesPerDayBest[1]) {
          downward =true;
        }

        else if (this.pricesPerDayBest[0] < this.pricesPerDayBest[1] ) {
          upward = true;
        }
      }
    }

    this.minAll.push(this.pricesPerDayBest[0]);
    this.minDayB.push(this.dayAllBest[0]);
    this.minAll.push(this.pricesPerDayBest[this.pricesPerDayBest.length - 1]);
    this.minDayB.push(this.dayAllBest[this.dayAllBest.length - 1]);

    this.maxAll.push(this.pricesPerDayBest[0]);
    this.maxDayB.push(this.dayAllBest[0]);
    this.maxAll.push(this.pricesPerDayBest[this.pricesPerDayBest.length - 1]);
    this.maxDayB.push(this.dayAllBest[this.dayAllBest.length - 1]);
    
    this.bestBuyingPrice = Math.min(...this.minAll);
    var ind1 = this.minAll.indexOf(this.bestBuyingPrice);
    this.bestBuyingDay = new Date(this.minDayB[ind1]).toLocaleDateString("fi-FI");

    this.bestSellingPrice = Math.max(...this.maxAll);
    var ind2 = this.maxAll.indexOf(this.bestSellingPrice);
    this.bestSellingDay = new Date(this.maxDayB[ind2]).toLocaleDateString("fi-FI");

    if (downward === true && this.maxAll.length === 2 && this.minAll.length === 2) {
      this.answerBestDays = 'Prices are going down, you should not buy or sell bitcoins.';
    }
    else if (upward === true && this.maxAll.length === 2 && this.minAll.length === 2) {
      var bestBuyingDayU = new Date(this.dayAll[0]).toLocaleDateString("fi-FI");
      var bestSellingDayU = new Date(this.dayAll[this.dayAll.length - 1]).toLocaleDateString("fi-FI");
      this.answerBestDays = 'The best day to buy is: ' + bestBuyingDayU + ' and best day to sell is: ' + bestSellingDayU + '.';
    }

    else {
      this.answerBestDays = 'The best day to buy is: ' + this.bestBuyingDay + ' and best day to sell is: ' + this.bestSellingDay + '.';
    }
  }

  resetData(): void {
    this.answerBestDays = '';
    this.answerMax = '';
    this.answerDown = '';
  }
}
