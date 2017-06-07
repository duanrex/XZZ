import { AlertController, LoadingController} from 'ionic-angular';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';




@Injectable()
export class UtilsService {

  public loading:any;

  constructor(
    public alertCtrl: AlertController,
    public http: Http,
    public loadingCtrl: LoadingController
  ) {
    console.log('Hello UtilsService Provider');
  }

  public showError(msg: string) {
    let alert = this.alertCtrl.create({
      title: '错误!',
      subTitle: msg,
      buttons: ['确定']
    });
    alert.present();
  }

  public showNotify(msg: string) {
    let alert = this.alertCtrl.create({
      title: '提示',
      subTitle: msg,
      buttons: ['确定']
    });
    alert.present();
  }

  public print(data: any) {
    console.log(data);
  }

  public presentLoadingDefault(str) {
    this.loading = this.loadingCtrl.create({
      content: str
    });
    this.loading.present();
  }

  public closeLoadingDefault(){
    this.loading.dismiss();
  }


}
