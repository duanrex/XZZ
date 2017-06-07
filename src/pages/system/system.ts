import { Component } from '@angular/core';
import { LoginPage } from './../login/login';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-system',
  templateUrl: 'system.html'
})
export class SystemPage {
  ipAddress: any;
  port: any;

  server: { hosturl: string, port: string } = {
      hosturl: '',
      port: ''
  };

  constructor(public navCtrl: NavController) {

  }

  updateHostPort(server) {
    // use window.localStorage
    if ((server.hosturl) && (server.port)) {
      let newUrl = 'http://' + server.hosturl + ":" + server.port + "/";
      window.localStorage.setItem('fullUrl', newUrl);
      this.navCtrl.push(LoginPage);
    }
  }

}
