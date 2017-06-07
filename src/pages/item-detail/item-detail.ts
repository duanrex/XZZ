import { UtilsService } from './../../providers/utils.service';
import { ImageShow } from './../image-show/image-show';
import { ViewController } from 'ionic-angular/index';
import { Component } from '@angular/core';
import { ActionSheetController, NavController, NavParams, Platform, ModalController, LoadingController } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html',
})


export class ItemDetailPage {
  item: any;
  view_images: Array<any> = [];
  base_images: Array<any> = [];
  share_images: Array<any> = [];
  pre_share_images: Array<any> = [];
  pre_download_images: Array<any> = [];
  pre_publish_images: Array<any> = [];
  publish_images: Array<any> = [];
  folder_name: string = "xiangzhizun/";
  base_path: string = "";
  abs_path: string = "";


  constructor(public loadingCtrl: LoadingController, public utilsService: UtilsService, private transfer: Transfer, private file: File, public modalCtrl: ModalController, private viewCtrl: ViewController, public navCtrl: NavController, public platform: Platform, navParams: NavParams, private clipboard: Clipboard, public actionSheetCtrl: ActionSheetController) {
    this.view_images = [];
    this.base_images = [];
    this.item = navParams.get('item');
    let image_size = this.item.pictures.length / 3;
    for (var i = 0; i < image_size; i++) {
      for (var j = i * 3; j < (i * 3) + 3; j++) {
        if (j < this.item.pictures.length) {
          this.item.pictures[j].id = j;
          this.item.pictures[j].isChecked = "selected";
          this.base_images.push(this.item.pictures[j]);
        }
      }
    }

    this.view_images.push({ "images": this.base_images });

    platform.ready().then(() => {
      if (this.platform.is("ios")) {
        this.base_path = this.file.dataDirectory;
        this.abs_path = this.base_path + this.folder_name;
      } else {
        this.base_path = this.file.externalApplicationStorageDirectory;
        this.abs_path = this.base_path + this.folder_name;
      }

      this.file.checkDir(this.base_path, this.folder_name).then(_ => {
      }).catch(err => {
        this.file.createDir(this.base_path, this.folder_name, true);
      });
    });
  }

  prepareShareImagesAndClipboard(): void {
    this.pre_share_images = [];
    let size = 9;
    let image_size = this.base_images.length;
    if (image_size < 9) {
      size = image_size;
    }

    for (var j = 0; j < size; j++) {
      if (this.base_images[j].isChecked == "selected") {
        this.pre_share_images.push(this.base_images[j].imageStorageId);
      }
    }

    this.clipboard.copy(this.item.content);
    this.clipboard.paste().then((resolve: string) => { }, (reject: string) => { alert("Error:" + reject) });
  }

  goBack(): void {
    this.navCtrl.pop();
  }

  goShareToCircle(): void {
    this.prepareShareImagesAndClipboard();
    this.prePublishImages();
    this.prepareDownloadAndShare("ToCircle");
  }

  goShareToPerson(): void {
    this.prepareShareImagesAndClipboard();
    this.prePublishImages();
    this.prepareDownloadAndShare("ToPerson");
  }

  goToShare() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: '分享至朋友圈',
          icon: !this.platform.is('ios') ? 'share' : null,
          handler: () => {
            this.goShareToCircle();
          }
        }, {
          text: '分享至朋友',
          icon: !this.platform.is('ios') ? 'person' : null,
          handler: () => {
            this.goShareToPerson();
          }
        }, {
          text: '取消',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  showImage(index: number) {
    this.share_images = [];
    for (var j = 0; j < this.base_images.length; j++) {
      this.share_images.push(this.base_images[j].imageStorageId);
    }

    let profileModal = this.modalCtrl.create(ImageShow, { index: index, images: this.share_images });
    profileModal.present();
  }

  share(action: string) {
    this.publish_images = [];
    var success = function (message) { }
    var failure = function () { console.log("Error calling Plugin"); }

    this.pre_publish_images.sort(function (a, b) { return a.id > b.id ? 1 : -1; });
    for (var i = 0; i < this.pre_publish_images.length; i++) {
      this.publish_images.push(this.pre_publish_images[i].url);
    }
    if (!this.platform.is("ios") && action == "ToPerson") {
      sharePics.sharePicsToPerson(success, failure, this.publish_images);
    } else {
      sharePics.sharePics(success, failure, this.publish_images);
    }
  }

  prePublishImages() {
    this.pre_publish_images = [];
    this.pre_download_images = [];
    let total = this.pre_share_images.length;
    for (var i = 0; i < total; i++) {
      let image_url = this.pre_share_images[i];
      let image_short_url = image_url.substring(0, image_url.indexOf("?"));
      let image_name = image_short_url.substring(image_short_url.lastIndexOf("/") + 1, image_short_url.length);
      let image_obj = { "id": i, "image_name": image_name, "url": image_url };
      this.pre_publish_images.push(image_obj);
    }
  }

  updateUrlForWechat(image_name: string, image_url: string) {
    for (var i = 0; i < this.pre_publish_images.length; i++) {
      let image_old_name = this.pre_publish_images[i].image_name;
      if (image_old_name == image_name) {
        this.pre_publish_images[i].url = image_url;
      }
    }
  }

  prepareDownloadAndShare(action: string) {
    let count: number = 0;
    let isShowError = false;
    const fileTransfer: TransferObject = this.transfer.create();

    this.utilsService.presentLoadingDefault("正在下载图片，请稍后...");
    for (var i = 0; i < this.pre_publish_images.length; i++) {
      let image_name = this.pre_publish_images[i].image_name;
      let image_url = this.pre_publish_images[i].url;

      this.file.checkFile(this.abs_path, image_name).then(_ => {
        let image_path = this.abs_path + image_name;

        if (this.platform.is("ios")) {
          this.updateUrlForWechat(image_name, image_path);
        } else {
          this.updateUrlForWechat(image_name, image_path.substring(7, image_path.length));
        }
        count++;
        if (this.pre_publish_images.length == count) {
          this.utilsService.closeLoadingDefault();
          this.share(action);
        }
      }).catch(err => {
        fileTransfer.download(image_url, this.abs_path + image_name, true).then((entry) => {
          let image_path = this.abs_path + image_name;
          if (this.platform.is("ios")) {
            this.updateUrlForWechat(image_name, image_path);
          } else {
            this.updateUrlForWechat(image_name, image_path.substring(7, image_path.length));
          }
          count++;
          if (this.pre_publish_images.length == count) {
            this.utilsService.closeLoadingDefault();
            this.share(action);
          }
        }, (error) => {
          if (error.code == 1) {
            if (!isShowError) {
              this.utilsService.showError("请确认文件是否存在!");
              isShowError = true;
            }
          }
          if (error.code == 2) {
            if (!isShowError) {
              this.utilsService.showError("无效的URL地址!");
              isShowError = true;
            }
          }
          if (error.code == 3) {
            if (!isShowError) {
              this.utilsService.showError("网络连接异常，请确认!");
              isShowError = true;
            }
          }
        });
      });
    }
  }

  // isPublish(id: number): void {
  //   for (let obj of this.base_images) {
  //     if (obj.id == id && obj.isChecked == "not-selected") {
  //       obj.isChecked = "selected";
  //       return;
  //     }
  //     if (obj.id == id && obj.isChecked == "selected") {
  //       obj.isChecked = "not-selected";
  //       return;
  //     }
  //   }
  // }

}
