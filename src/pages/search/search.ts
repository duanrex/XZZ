import { UtilsService } from './../../providers/utils.service';
import { ItemDetailPage } from './../item-detail/item-detail';
import { SearchService } from './../../providers/search.service';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  user: any;
  currentItems: any = [];
  query_items: Array<any> = [];

  start: any = 0;
  length: any = 5;

  noMore: boolean = false;
  noData: boolean = false;

  input: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, platform: Platform, public utilsService: UtilsService, public searchService: SearchService) {
    platform.ready().then(() => {
      this.user = JSON.parse(window.localStorage.getItem('user'));
      this.input = {
        "project": "spics",
        "table": "ShareGoods",
        "order": {
          "sortNo": "asc"
        },
        "start": 0,
        "length": 5,
        "columns": [
          "id",
          "name",
          "goodsNumber",
          "goodsPrice",
          "content",
          "pictures",
          "creator",
          "createTime",
          { "pictures": ["imageStorageId"] }
        ],
        "filter": {
          "content": {
            "like": ""
          },
          "user.id": {
            "eq": this.user.admin
          }
        }
      };
      this.input.start = 0;
      this.input.length = this.length;
      this.getGoods(this.input, "init");
    });
  }

  clearItem(ev) {
    this.input.filter.content.like = "";
    this.getGoods(this.input, "init");
  }

  /**
   * Perform a service for the proper items.
   */
  getItems(ev) {
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.input.filter.content.like = val.trim();
    } else {
      this.input.filter.content.like = "";
    }
    this.getGoods(this.input, "init");
  }

  getGoods(input: any, action: any) {
    this.noData = false;
    if (action === "init") {
      this.utilsService.presentLoadingDefault("正在加载数据，请稍后...");
    }
    this.searchService.getGoods(input).then(data => {
      this.query_items = data;
      if (action != "infinite") {
        this.currentItems = [];
      }
      if (this.query_items.length > 0) {
        for (var i = 0; i < this.query_items.length; i++) {
          this.currentItems.push(this.query_items[i]);
        }
      } else {
        if (action === "infinite" && this.query_items.length == 0) {
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

}
