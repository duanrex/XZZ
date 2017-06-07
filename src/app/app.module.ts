import { ImageView } from './app.pip';
import { Transfer } from '@ionic-native/transfer';
import { UtilsService } from './../providers/utils.service';
import { SystemPage } from './../pages/system/system';
import { LongPress } from './../providers/longPress';
import { ImageShow } from './../pages/image-show/image-show';
import { Clipboard } from '@ionic-native/clipboard';
import { Diagnostic } from '@ionic-native/diagnostic';
import { UserService } from './../providers/user.service';
import { SettingsService } from './../providers/settings.service';
import { SearchService } from './../providers/search.service';
import { HomeService } from './../providers/home.service';
import { PasswordPage } from './../pages/password/password';
import { ItemDetailPage } from './../pages/item-detail/item-detail';
import { SettingsPage } from './../pages/settings/settings';
import { Api } from './../providers/api';
import { HttpModule, Http } from '@angular/http';
import { LoginPage } from './../pages/login/login';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicImageViewerModule } from 'ionic-img-viewer';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { SearchPage } from "../pages/search/search";
import { Keyboard } from "@ionic-native/keyboard";
import { File } from '@ionic-native/file';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SettingsPage,
    SearchPage,
    ItemDetailPage,
    PasswordPage,
    ImageShow,
    LongPress,
    SystemPage,
    ImageView
  ],
  imports: [
    BrowserModule,
    HttpModule,
    TranslateModule,
    IonicImageViewerModule,
    IonicModule.forRoot(MyApp,{
      scrollAssist: false,
      autoFocusAssist: true
    }),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SettingsPage,
    SearchPage,
    ItemDetailPage,
    PasswordPage,
    ImageShow,
    SystemPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UserService,
    SettingsService,
    Api,
    HomeService,
    SearchService,
    UtilsService,
    Diagnostic,
    Clipboard,
    Keyboard,
    File,
    Transfer,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
