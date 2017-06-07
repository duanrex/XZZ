import { UtilsService } from '../../providers/utils.service';
import { PasswordPage } from './../password/password';
import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { File } from '@ionic-native/file';

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  user: any;
  folder_name: string = "xiangzhizun";
  base_path: string = "";

  constructor(public utilsService: UtilsService, public platform: Platform, private file: File, public navCtrl: NavController,
    public translate: TranslateService, public navParams: NavParams) {
    this.user = JSON.parse(window.localStorage.getItem('user'));

    platform.ready().then(() => {
      if (this.platform.is("ios")) {
        this.base_path = this.file.dataDirectory;
      } else {
        this.base_path = this.file.externalRootDirectory;
      }
    });
  }

  logOut() {
    window.localStorage.removeItem('user');
    this.navCtrl.push(LoginPage);
  }

  gotoUpdatePassword() {
    this.navCtrl.push(PasswordPage);
  }

  clearCache() {
    this.file.checkDir(this.base_path, this.folder_name).then(_ => {
      this.file.listDir(this.base_path, this.folder_name).then((entry => {
        if (entry.length == 0) {
          this.utilsService.showNotify("清除成功!");
          return;
        }
        for (var j = 0; j < entry.length; j++) {
          this.file.removeFile(this.base_path + this.folder_name + "/", entry[j].name);
        }
        this.utilsService.showNotify("清除成功!");
      }))
    }).catch(err => {
      this.utilsService.showNotify("清除成功!");
    });
  }

}
