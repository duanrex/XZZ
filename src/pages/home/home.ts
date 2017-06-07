import { UtilsService } from './../../providers/utils.service';
import { ItemDetailPage } from './../item-detail/item-detail';
import { HomeService } from './../../providers/home.service';
import { SearchPage } from './../search/search';
import { SettingsPage } from './../settings/settings';
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: any;
  data: Array<any> = [];
  goods: Array<any> = [];
  query_goods: Array<any> = [];

  start: number = 0;
  length: number = 5;
  noMore: boolean = false;
  noData: boolean = false;

  input: any;
  current_date: any = new Date().toISOString().slice(0, 10);
  begin_time: any = new Date().toISOString().slice(0, 10);
  end_time: any = new Date().toISOString().slice(0, 10);

  constructor(public navCtrl: NavController, platform: Platform, public utilsService: UtilsService, public homeService: HomeService, private diagnostic: Diagnostic) {
    platform.ready().then(() => {
      let successCallback = (isAvailable) => { console.log('Is available? ' + isAvailable); };
      let errorCallback = (e) => console.error(e);
      this.diagnostic.requestRuntimePermissions([this.diagnostic.permission.WRITE_EXTERNAL_STORAGE, this.diagnostic.permission.READ_EXTERNAL_STORAGE,
      this.diagnostic.permission.ACCESS_COARSE_LOCATION,this.diagnostic.permission.ACCESS_FINE_LOCATION]).then(successCallback, errorCallback);

      this.begin_time = new Date();
      this.begin_time.setHours(0);
      this.begin_time.setMinutes(0);
      this.begin_time.setSeconds(0);
      this.begin_time.setMilliseconds(0);

      this.end_time = new Date();
      this.end_time.setHours(23);
      this.end_time.setMinutes(59);
      this.end_time.setSeconds(59);
      this.end_time.setMilliseconds(999);

      this.user = JSON.parse(window.localStorage.getItem('user'));

      let userId = this.user.admin;
      if (userId == "") {
        userId = this.user.id;
      }

      this.input = {
        "project": "spics",
        "table": "SharePlan",
        "order": {
          "sortNo": "asc"
        },
        "start": 0,
        "length": 1,
        "columns": [
          "id",
          "name",
          "publishDate",
          { "sharePlanShareGoods": ["id", "name", "sortNo", "createTime", "creator", "goodsNumber", "goodsPrice", "content", { "pictures": ["imageStorageId"] }] }
        ],
        "filter": {
          "publishDate": {
            "ge": "",
            "le": ""
          },
          "user.id": {
            "eq": userId
          }
        }
      };

      this.input.start = 0;
      this.input.length = this.length;
      this.input.filter.publishDate.ge = this.begin_time.getTime();
      this.input.filter.publishDate.le = this.end_time.getTime();
      this.getGoods(this.input, "init");
    });


  }

  gotoSetting() {
    this.navCtrl.push(SettingsPage);
  }

  gotoSearch() {
    this.navCtrl.push(SearchPage);
  }

  getGoods(input: any, action: any) {
    this.noData = false;
    if (action === "init") {
      this.utilsService.presentLoadingDefault("正在加载数据，请稍后...");
    }
    this.homeService.getGoods(input).then(data => {
      this.data = data;
      if (action != "infinite") {
        this.goods = [];
      }
      if (this.data.length > 0) {
        this.query_goods = this.data[0].sharePlanShareGoods;
        this.query_goods.sort(function (a, b) { return a.sortNo < b.sortNo ? 1 : -1; });

        for (var i = 0; i < this.query_goods.length; i++) {
          this.goods.push(this.query_goods[i]);
        }
      } else {
        if (action === "infinite" && this.data.length == 0) {
          this.noMore = true;
        } else {
          this.noData = true;
        }
      }

      if (action === "init") {
        this.utilsService.closeLoadingDefault();
      }
    });
  }

  showDetail(good: any) {
    this.navCtrl.push(ItemDetailPage, { item: good });
  }

  doRefresh(refresher) {
    this.noMore = false;
    setTimeout(() => {
      this.input.start = 0;
      this.input.length = this.length;
      this.getGoods(this.input, "refresh");
      this.start = 0;
      refresher.complete();
    }, 2000);
  }

  doInfinite(infiniteScroll) {
    this.noMore = false;

    setTimeout(() => {
      this.start += this.length;
      this.input.start = this.start;
      this.input.length = this.length;
      this.getGoods(this.input, "infinite");
      infiniteScroll.complete();
    }, 500);
  }

  onChangeDate() {
    let dateParts = this.current_date.split("-");
    let searchBeginTime = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    searchBeginTime.setHours(0);
    searchBeginTime.setMinutes(0);
    searchBeginTime.setSeconds(0);
    searchBeginTime.setMilliseconds(0);
    console.log(searchBeginTime.getTime());

    let searchEndTime = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    searchEndTime.setHours(23);
    searchEndTime.setMinutes(59);
    searchEndTime.setSeconds(59);
    searchEndTime.setMilliseconds(999);
    console.log(searchEndTime.getTime());

    this.input.start = 0;
    this.input.length = this.length;
    this.input.filter.publishDate.ge = searchBeginTime.getTime();
    this.input.filter.publishDate.le = searchEndTime.getTime();
    this.getGoods(this.input, "init");
  }
}
