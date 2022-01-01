import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class GetApiService {
  apiEndpoint = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur';

  constructor(private http: HttpClient) { }

  apiCall(dateFrom: any, dateTo: any): Observable<any[]>{

    var dateFromEpoch = new Date(dateFrom).getTime() / 1000;
    var dateToEpoch = new Date(dateTo).getTime() / 1000;
    var dateToEpoch = dateToEpoch + 3600;

    let params = new HttpParams()
      .set('from', dateFromEpoch)
      .set('to', dateToEpoch)

    return this.http.get<any[]>(this.apiEndpoint, { params })
      .pipe(catchError(this.handleError));
  }
   
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error.';
    if (error.error instanceof ErrorEvent) {
      // client side error
      errorMessage = 'Error: ${error.error.message}';
    } else {
      errorMessage = 'Error code: ${error.status}\nMessage: ${error.message}';
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
