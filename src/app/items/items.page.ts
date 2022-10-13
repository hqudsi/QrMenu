import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, ModalController } from '@ionic/angular';
import { OpenImagePage } from '../modals/open-image/open-image.page';
import { FireServiceService } from '../services/fire-service.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  top: number = 0;

  cafeData: any;
  category: any;
  items: any;
  categories = [];
  currenctLanguage: String = '';
  backBtnStyle = 'header-back-button-en';

  currentCategoryIndex: any;

  segment: string;

  sub1: any;
  sub2: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fireservice: FireServiceService,
    private languageService: LanguageService,
    private renderer: Renderer2,
    private modalController: ModalController
  ) {
    this.currenctLanguage = this.languageService.selected;
    if (this.currenctLanguage === 'ar') {
      this.backBtnStyle = 'header-back-button-ar';
    }
  }

  ngOnInit() {
    // let element: any = document.getElementById('main-content');
    // console.log(element);
    // this.renderer.setStyle(element, 'top', "0px");
    if (this.route.snapshot.data['data']) {
      this.category = this.route.snapshot.data['data'].category;
      this.segment = this.category.type_id;
      this.cafeData = this.route.snapshot.data['data'].cafeData;
      this.sub1 = this.fireservice.getCafeCategories(this.cafeData.id, this.segment).subscribe(res => {
        this.categories = res;
        this.currentCategoryIndex = this.categories.findIndex(element => element.id == this.category.id);
      });
      this.sub2 = this.fireservice.getItemsOfCategory(this.category.id, this.cafeData.id).subscribe(res => {
        this.items = res;
      });
    } else {
      this.router.navigateByUrl('/', { replaceUrl: true });
    }
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

  logScrolling(event) {
    this.top = event.detail.scrollTop;
  }

  scrollToTop() {
    this.content.scrollToTop(this.top);
  }

  changeSegment(segment) {
    // this.categories = [];
    // this.items = [];
    this.currentCategoryIndex = 0;
    this.sub1 = this.fireservice.getCafeCategories(this.cafeData.id, segment).subscribe(res => {
      this.categories = res;
      if (this.categories.length > 0) {
        this.category = this.categories[0];
        this.sub2 = this.fireservice.getItemsOfCategory(this.category.id, this.cafeData.id).subscribe(res => {
          this.items = res;
        });
      } else {
        this.category = null;
        this.items = []
      }
    });
  }

  async openImage(img) {
    const modal = await this.modalController.create({
      component: OpenImagePage,
      componentProps: { img: img }
    });
    await modal.present();
  }

  goPrev() {
    if (this.currentCategoryIndex > 0) {
      this.currentCategoryIndex = this.currentCategoryIndex - 1;
      this.category = this.categories[this.currentCategoryIndex];
      this.items = null;
      this.sub2 = this.fireservice.getItemsOfCategory(this.category.id, this.cafeData.id).subscribe(res => {
        this.items = res;
      });
    }
  }

  goNext() {
    if (this.currentCategoryIndex < this.categories.length) {
      this.currentCategoryIndex = this.currentCategoryIndex + 1;
      this.category = this.categories[this.currentCategoryIndex];
      this.items = null;
      this.sub2 = this.fireservice.getItemsOfCategory(this.category.id, this.cafeData.id).subscribe(res => {
        this.items = res;
      });
    }
  }
}
