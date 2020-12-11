import { Component } from '@angular/core';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { ImgurApiService } from '../services/imgur-api.service';
import { PhotoService } from '../services/photo.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { imageInfo } from '../models/imageInfo';
import { NavigationExtras, Router } from '@angular/router';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  display_list: imageInfo[] = [];

  constructor(public photoService: PhotoService,
            private router: Router,
            public imgurApiService: ImgurApiService,
            public localNotifications: LocalNotifications,
            public alertController: AlertController,
            public actionSheetController: ActionSheetController,
            public camera: Camera,
            ) {}

  async ngOnInit() {
    //await this.photoService.loadSaved();
  }

  ionViewWillEnter() {
    this.display_list = this.imgurApiService.account_images;
    this.imgurApiService.reload_account_images().then((res) => {
      this.display_list = this.imgurApiService.account_images;
    });
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

  /*public async showActionSheet(photo, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
         }
      }]
    });
    await actionSheet.present();
  }*/

  async addPicture() {
    const self = this;
    let actionSheet = await self.actionSheetController.create({
        header: "Add picture",
        buttons: [
            /*{
                text: "Gallerie (multiple)",
                icon: 'edit',
                handler: () => {
                    self.photoService.takePicture(false);
                }
            },*/
            {
                text: "Camera",
                handler: () => {
                    self.photoService.takePicture(true, self.camera.PictureSourceType.CAMERA).then((img) => {
                      self.alert_upload(img);
                    });
                }
            },
            {
                text: "Gallery",
                handler: () => {
                    self.photoService.takePicture(true, self.camera.PictureSourceType.PHOTOLIBRARY).then((img) => {
                      self.alert_upload(img);
                    });
                }
            },
            {
                text: "Cancel",
                role: 'cancel'
            }
        ]
    });
    await actionSheet.present();
  }

  async alert_upload(img) {
    const self = this;
    let alert = await this.alertController.create({
      header: "",
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Title'
        },
        {
          name: 'description',
          type: 'text',
          placeholder: 'Description'
        },
        {
          name: 'img_name',
          type: 'text',
          placeholder: "Picture name"
        },
      ],
      buttons: [
        {
          text: "Upload picture",
          handler: (data) => {
            console.log("alert_upload: data: ", data);
            if (!data.title) {
              self.genericAlert("Error", "Title is required")
              return;
            }
            if (!data.description) {
              self.genericAlert("Error", "Description is required")
              return;
            }
            if (!data.img_name) {
              self.genericAlert("Error", "An image name is required")
              return;
            }

            let progress = 5;
            self.localNotifications.schedule({
              id: 1,
              text: 'Your image is being uploaded..',
              progressBar: { value: progress },
              silent: true
            });
            let inter = setInterval(() => {
              if (progress < 90) {
                progress += 5;
              }
              else {
                return;
              }
              self.localNotifications.update({
                id: 1,
                text: 'Your image is being uploaded..',
                progressBar: { value: progress },
                silent: true
              });
            }, 500);
            self.imgurApiService.request_upload_image(img, "base64", data.img_name, data.title, data.description).then(() => {
              self.imgurApiService.reload_account_images().then((res) => {
                clearInterval(inter);
                self.localNotifications.update({
                  id: 1,
                  text: 'Your image has been uploaded..',
                  progressBar: { value: 100 }
                });
                self.display_list = self.imgurApiService.account_images;
              });
            });
          }
        },
        {
          text: "Cencal",
          role: 'Cancel'
        }
      ]
    });
    await alert.present();
  }

  async genericAlert(header: string, msg: string) {
    let alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: [{
        text: "OK"
      }]
    });
    await alert.present();
  }
}
