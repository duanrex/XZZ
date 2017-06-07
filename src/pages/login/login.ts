import { UtilsService } from './../../providers/utils.service';
import { SystemPage } from './../system/system';
import { UserService } from './../../providers/user.service';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { TranslateService } from 'ng2-translate/ng2-translate';
import { Keyboard } from '@ionic-native/keyboard';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { phone: string, password: string } = {
    phone: '',
    password: ''
  };

  result: any;

  input: any = {"phone": "","password": ""};

  // Our translated text strings
  private loginErrorString: string;

  constructor(public platform: Platform, private keyboard: Keyboard, public navCtrl: NavController,
    public userService: UserService,
    public translateService: TranslateService,
    public utilsService: UtilsService, ) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })

    platform.ready().then(() => {
      this.keyboard.disableScroll(true);
    });
  }

  // Attempt to login in through our User service
  doLogin() {
    this.utilsService.presentLoadingDefault("正在登录，请稍后...");
    this.input.phone = this.account.phone;
    this.input.password = Md5.hashStr(this.account.password).toString();
    this.userService.login(this.input).then(data => {
      this.result = data;
      this.utilsService.closeLoadingDefault();
      if (this.result != null) {
         console.log(this.result);
        window.localStorage.setItem('user', JSON.stringify(this.result));
        this.navCtrl.push(HomePage);
      } else {
        this.utilsService.showError('用户名或密码错误!');
      }
    }, err => {
      this.utilsService.closeLoadingDefault();
      this.utilsService.showError('连接超时，请联系管理员!');
      console.log(err);
    });
  }

  keyLongPressFn() {
    this.navCtrl.push(SystemPage);
  }
}
