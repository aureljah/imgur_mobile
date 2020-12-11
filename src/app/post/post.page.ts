import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { imageInfo } from '../models/imageInfo';
import { ImgurApiService } from '../services/imgur-api.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';


@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {

  image: imageInfo = undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public alertController: AlertController,
    public socialSharing: SocialSharing,
    public imgurApiService: ImgurApiService,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.image = this.router.getCurrentNavigation().extras.state.image;
      }
    });
  }

  async share() {
    const self = this;
    let alert = await this.alertController.create({
      header: "Share",
      message: "Add a message",
      inputs: [
        {
          name: 'msg',
          type: 'text',
          placeholder: 'Add a message',
          value: "Check it out on imgur !"
        },
      ],
      buttons: [
        {
          text: "Share",
          handler: (data) => {
            console.log("alert_share: data: ", data);
            let options = {
              message: data.msg, // not supported on some apps (Facebook, Instagram)
              subject: data.msg, // fi. for email
              //files: ['', ''], // an array of filenames either locally or remotely
              url: this.image.link,
              chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title
              //appPackageName: 'com.apple.social.facebook', // Android only, you can provide id of the App you want to share with
              //iPadCoordinates: '0,0,0,0' //IOS only iPadCoordinates for where the popover should be point.  Format with x,y,width,height
            };
            self.socialSharing.shareWithOptions(options).then((res) => {
              console.log("shareWithOptions: res: ", res);
            });
          }
        },
        {
          text: "Cancel",
          role: 'Cancel'
        }
      ]
    });
    await alert.present();
  }
}
