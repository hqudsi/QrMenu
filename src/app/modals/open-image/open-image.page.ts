import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-open-image',
  templateUrl: './open-image.page.html',
  styleUrls: ['./open-image.page.scss'],
})
export class OpenImagePage implements OnInit {

  @ViewChild('slider', {read: ElementRef}) slider: ElementRef;

  img: any;

  sliderOpts = {
    zoom: {
      maxRaio: 3
    }
  };
  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  close() {
    this.modalController.dismiss();
  }

  zoom(zoomIn: boolean) {
    let zoom = this.slider.nativeElement.swiper.zoom;
    if (zoomIn) {
      zoom.in();
    } else {
      zoom.out();
    }
  }

}
