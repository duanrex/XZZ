import { ViewController } from 'ionic-angular/index';
import { NavParams, Slides, NavController } from 'ionic-angular';
import { Component, Renderer, ViewChild } from '@angular/core';

@Component({
  selector: 'page-image-show',
  templateUrl: 'image-show.html',
})

export class ImageShow {

  @ViewChild('myProfile') slides: Slides;

  index: number;
  images: Array<any>;

  constructor(
    public navCtrl: NavController,
    params: NavParams,
    public renderer: Renderer,
    public viewCtrl: ViewController
  ) {
    this.index = params.get('index');
    this.images = params.get('images');
  }

  ngAfterViewInit() {
    this.slides.initialSlide = this.index;
    this.slides.pager = true;
  }

    goBack(): void {
    this.navCtrl.pop();
  }

}


