import {QUERY_WORD, HTTP_HEADERS } from './../models/cons';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';


@Injectable()
export class SearchService {

  constructor(public http: Http) {
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  getGoods(body: any): Promise<any> {
    return this.http
      .post(window.localStorage.fullUrl + QUERY_WORD, JSON.stringify(body), { headers: HTTP_HEADERS })
      //.timeout(6000)
      .toPromise()
      .then(res => res.json().data)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
