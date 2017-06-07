import { HomePage } from './../pages/home/home';
import { LoginPage } from './../pages/login/login';
import { Component, ViewChild } from '@angular/core';
import { IonicApp, Keyboard, Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;
  @ViewChild('myNav') nav: Nav;
  backButtonPressed: boolean = false;  //用于判断返回键是否触发

  constructor(public ionicApp: IonicApp, public keyboard: Keyboard, public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public toastCtrl: ToastController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      if (this.platform.is('android')) {
        this.registerBackButtonAction();//注册返回按键事件
      }
      let user = window.localStorage.getItem("user");
      if (user != null) {
        this.rootPage = HomePage;
      }

      window.localStorage.setItem('fullUrl', 'http://47.92.96.25:9101/');
    });
  }

  registerBackButtonAction() {
    this.platform.registerBackButtonAction(() => {
      if (this.keyboard.isOpen()) {
        this.keyboard.close();
        return;
      }
      let activePortal = this.ionicApp._modalPortal.getActive();
      if (activePortal) {
        activePortal.dismiss().catch(() => { });
        activePortal.onDidDismiss(() => { });
        return;
      }
      let activeVC = this.nav.getActive();
      if (activeVC.instance instanceof HomePage || !this.nav.canGoBack()) {
        this.showExit()
      }else{
        this.nav.pop();
      }
    }, 1);
  }

  //双击退出提示框
  showExit() {
    if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
      this.platform.exitApp();
    } else {
      this.toastCtrl.create({
        message: '再按一次退出应用',
        duration: 2000,
        position: 'bottom',
        dismissOnPageChange: true,
        cssClass: "toast-container"
      }).present();
      this.backButtonPressed = true;
      setTimeout(() => this.backButtonPressed = false, 2000);//2秒内没有再次点击返回则将触发标志标记为false
    }
  }
}

