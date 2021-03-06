import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AlertController, LoadingController } from '@ionic/angular';
import { ImgurApiService } from '../services/imgur-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    public router: Router,
    public platform: Platform,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public imgurApiService: ImgurApiService,
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    let loading = await this.loadingController.create({
      message: "Connecting..."
    });
    await loading.present();

    let res = await this.imgurApiService.tryAutoLogin().catch(async (err) => {

      let alert = await this.alertController.create({
        header: 'Error',
        message: "Sorry, we are unable to connect to imgur"
      });
      await alert.present();
      return;
    });
    if (res === true) {
      this.router.navigate([""]);
    }
    loading.dismiss();
  }

  async login() {
    let loading = await this.loadingController.create({
      message: "Connecting..."
    });
    await loading.present();

    if (!this.platform.is("cordova")) {
      await this.imgurApiService.reload_all_viral_images();
      await loading.dismiss();
      this.router.navigate([""]);
      return;
    }

    this.imgurApiService.login().then(async (res) => {
      loading.dismiss();
      if (res === true) {
        this.router.navigate([""]);
      }
      else {
        let alert = await this.alertController.create({
          header: 'Error',
          message: "Sorry, we are unable to connect to imgur"
        });
        await alert.present();
      }
    }).catch(async (err) => {
      loading.dismiss();
      let alert = await this.alertController.create({
        header: 'Error',
        message: "Sorry, we are unable to connect to imgur"
      });
      await alert.present();
    });
  }
}
