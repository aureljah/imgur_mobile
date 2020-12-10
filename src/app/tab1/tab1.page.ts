import { Component } from '@angular/core';
import { ImgurApiService } from '../services/imgur-api.service';
import { accountInfo } from '../models/accountInfo';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {

  constructor(
    public imgurApiService: ImgurApiService
  ) {}

  connectAccount() {
    this.imgurApiService.authorize_account().then((res) => {
      console.log("connectAccount: RESOLVED !");
    }).catch((err) => {
      console.error("connectAccount: REJECTED !");
    });
  }

  get_account_image() {
    this.imgurApiService.request_all_account_images().then((res) => {
      console.log("request_all_account_images: RESOLVED ! => ", res);
    }).catch((err) => {
      console.error("request_all_account_images: REJECTED ! => ", err);
    });
  }

  get_account_info() {
    this.imgurApiService.request_account_info().then((res) => {
      let account_info = new accountInfo(this.imgurApiService.account_username, res);
      console.log(account_info);
    }).catch((err) => {
      console.error("request_account_info: REJECTED ! => ", err);
    });
  }
}
