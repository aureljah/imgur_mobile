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

}
