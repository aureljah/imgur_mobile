import { Component } from '@angular/core';
import { ImgurApiService } from '../services/imgur-api.service';
import { accountInfo } from '../models/accountInfo';
import { imageInfo } from '../models/imageInfo';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {

  constructor(
    public imgurApiService: ImgurApiService
  ) {}

  ionViewWillEnter() {

  }

  seeCard(image: imageInfo) {
    console.log("seeCard: ", image);
  }
}
