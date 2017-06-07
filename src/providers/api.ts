import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {

  constructor(public http: Http) {
  }

  get(endpoint: string, params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    // Support easy query params for GET requests
    if (params) {
      let p = new URLSearchParams();
      for(let k in params) {
        p.set(k, params[k]);
      }
      // Set the search field if we have params and don't already have
      // a search field set in options.
      options.search = !options.search && p || options.search;
    }

    return this.http.get(window.localStorage.fullUrl + '/' + endpoint, options);
  }

  post(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.post(window.localStorage.fullUrl + '/' + endpoint, body, options).timeout(10000);
    //return this.http.post(window.localStorage.fullUrl + '/' + endpoint, body, options).timeout(6000);
  }

  put(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(window.localStorage.fullUrl + '/' + endpoint, body, options);
  }

  delete(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.post(window.localStorage.fullUrl + '/' + endpoint, body, options);
  }

  patch(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(window.localStorage.fullUrl + '/' + endpoint, body, options);
  }
}
