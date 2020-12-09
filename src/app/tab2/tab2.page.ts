import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { PhotoService } from '../services/photo.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public photoService: PhotoService,
            public actionSheetController: ActionSheetController,
            public camera: Camera,
            ) {}

  async ngOnInit() {
    //await this.photoService.loadSaved();
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
        header: "Ajouter photo",
        buttons: [
            {
                text: "Gallerie",
                icon: 'edit',
                handler: () => {
                    self.photoService.takePicture(false);
                }
            },
            {
                text: "Camera",
                handler: () => {
                    self.photoService.takePicture(true, self.camera.PictureSourceType.CAMERA);
                }
            },
            {
                text: "Gallerie (only one)",
                handler: () => {
                    self.photoService.takePicture(true, self.camera.PictureSourceType.PHOTOLIBRARY);
                }
            },
            {
                text: "Annuler",
                role: 'cancel'
            }
        ]
    });
    await actionSheet.present();
}
}
