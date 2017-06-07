import { QUERY_WORD, HTTP_HEADERS, UPDATE_WORD, LOGIN_WORD } from './../models/cons';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class UserService {
  _user: any;

  constructor(public http: Http, public api: Api) {
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(body: any) {
     return this.http
      .post(window.localStorage.fullUrl + LOGIN_WORD, JSON.stringify(body), { headers: HTTP_HEADERS })
      //.timeout(6000)
      .toPromise()
      .then(res => res.json().data)
      .catch(this.handleError);
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  getUser(body: any) {
    return this.http
      .post(window.localStorage.fullUrl + QUERY_WORD, JSON.stringify(body), { headers: HTTP_HEADERS })
      //.timeout(6000)
      .toPromise()
      .then(res => res.json().data)
      .catch(this.handleError);
  }

  /**
 * Send a POST request to our signup endpoint with the data
 * the user entered on the form.
 */
  updatePassword(body: any) {
    return this.http
      .post(window.localStorage.fullUrl + UPDATE_WORD, JSON.stringify(body), { headers: HTTP_HEADERS })
      //.timeout(6000)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.user;
  }
}
