import { Component, NgZone } from '@angular/core';
import { ChangeDetectorRef } from "@angular/core";
import { ImgurApiService } from '../services/imgur-api.service';
import { accountInfo } from '../models/accountInfo';
import { imageInfo } from '../models/imageInfo';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  page_size: number = 10;
  display_list: imageInfo[] = [];
  page: number = 0;

  //max_down_scroll: boolean = false;
  max_up_scroll: boolean = true;

  constructor(
    public ngZone: NgZone,
    private router: Router,
    public changeDetectorRef: ChangeDetectorRef,
    public imgurApiService: ImgurApiService
  ) {}

  ionViewWillEnter() {
    const self = this;
    if (this.display_list.length < this.page_size) {
      this.display_list = this.imgurApiService.viral_images.slice(0, this.page_size);
    }

    if (this.display_list.length < 1 && this.imgurApiService.viral_images.length < 1) {
      let interval = setInterval(() => {
        if (self.imgurApiService.viral_images.length > 0) {
          self.display_list = self.imgurApiService.viral_images.slice(0, self.page_size);
          clearInterval(interval);
        }
      }, 500);
    }
  }

  loadForwardDisplayList() {
    this.page += 1;

    let start_idx = (this.page * this.page_size);
    if ((start_idx + this.page_size) >= this.imgurApiService.viral_images.length) {
      this.imgurApiService.load_more_viral_images();
    }
    if (start_idx >= this.imgurApiService.viral_images.length) {
      // nothing to add yet;
      return;
    }

    this.ngZone.run(() => {
      // add
      let counter = 0;
      for (let i = start_idx ; i < this.imgurApiService.viral_images.length ; i++) {
        this.display_list.push(this.imgurApiService.viral_images[i]);
        counter++;
        if (counter === 10) {
          break;
        }
      }

      // delete wxhen it's too much
      let nb_to_delete = this.display_list.length - (this.page_size * 2);
      while (nb_to_delete > 0) {
        this.display_list.shift();
        nb_to_delete -= 1;
      }

      if (this.page > 1) {
        this.max_up_scroll = false;
      }

      /*let end_idx = (this.page * this.page_size) + this.page_size;
      if (end_idx >= this.imgurApiService.viral_images.length) {
        this.max_down_scroll = true;
      }*/
    });
  }

  loadBackwardDisplayList() {
    if (this.page <= 1) {
      this.max_up_scroll = true;
      return; // nothing to do
    }
    else {
      this.max_up_scroll = false;
    }

    this.page -= 1;

    let start_idx = (this.page * this.page_size) - 1;
    if (start_idx >= this.imgurApiService.viral_images.length) {
      // nothing to add yet;
      return;
    }

    //let tmp_list: imageInfo[] = [];
    this.ngZone.run(() => {
      // add
      let counter = 0;
      for (let i = start_idx ; i >= 0 ; i--) {
        if (this.display_list.includes(this.imgurApiService.viral_images[i]) === true) {
          continue;
        }
        this.display_list.unshift(this.imgurApiService.viral_images[i]);
        counter++;
        if (counter === 10) {
          break;
        }
      }

      // delete wxhen it's too much
      let nb_to_delete = this.display_list.length - (this.page_size * 2);
      while (nb_to_delete > 0) {
        this.display_list.pop();
        nb_to_delete -= 1;
      }

      //this.max_down_scroll = false;

      this.changeDetectorRef.detectChanges();
      console.log("scrolling to 11th elem or last");
      this.scrollToIdxElem(11);
    });
  }

  scrollToIdxElem(idx: number) {
    let list_image = document.getElementsByClassName("list-image");
    if (list_image && list_image.length > 0 && list_image[0].children && list_image[0].children.length > 0) {
      let child_list = list_image[0].children;

      let child = child_list[(child_list.length - 1)]; // last child
      if (child_list.length > idx) {
        child = child_list[idx];
      }

      console.log("will scrollIntoView: elem: ", child);
      child.scrollIntoView();
    }
  }

  loadMore(event, forward: boolean) {
    const self = this;
    self.ngZone.run(() => {
      if (forward) {
        self.loadForwardDisplayList();
        console.log("after loadForwardDisplayList: page: ", self.page, " - list: ", self.getListTitle());
      }
      else {
        self.loadBackwardDisplayList();
        console.log("after loadBackwardDisplayList: page: ", self.page, " - list: ", self.getListTitle());
      }
      event.target.complete();
    });
    return;
  }

  getListTitle() {
    let list: string[] = [];
    for (let i = 0 ; i < this.display_list.length ; i++) {
      list.push(this.display_list[i].title);
    }
    return list;
  }

  seeCard(image: imageInfo) {
    console.log("seeCard: ", image);

    let navigationExtras: NavigationExtras = {
      state: {
        image: image
      }
    };

    this.router.navigate(['post'], navigationExtras);
  }
}
