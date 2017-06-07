import { Api } from './api';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

/**
 * A simple settings/config class for storing key/value pairs with persistence.
 */
@Injectable()
export class SettingsService {

  constructor(public http: Http, public api: Api) {
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    let seq = this.api.post('login', accountInfo).share();

    seq
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, mark the user as logged in
        if(res.status == 'success') {
        } else {
        }
      }, err => {
        console.error('ERROR', err);
      });

    return seq;
  }

}
