import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: any[] = [];

  constructor(public platform: Platform,
    public storage: Storage,
    public camera: Camera,
    public imagePicker: ImagePicker
    ) {
   }

  /*public async loadSaved() {
    // Retrieve cached photo array data
    //const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    //this.photos = JSON.parse(photoList.value) || [];

    // If running on the web...
    if (!this.platform.is('hybrid')) {
      // Display the photo by reading into base64 format
      for (let photo of this.photos) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
            path: photo.filepath,
            directory: FilesystemDirectory.Data
        });
      
        // Web platform only: Load the photo as base64 data
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }*/

  /* Use the device camera to take a photo:
  // https://capacitor.ionicframework.com/docs/apis/camera
  
  // Store the photo data into permanent file storage:
  // https://capacitor.ionicframework.com/docs/apis/filesystem
  
  // Store a reference to all photo filepaths using Storage API:
  // https://capacitor.ionicframework.com/docs/apis/storage
  */
  public async takePicture(useCameraPlugin: boolean, sourceType=null) {
    const self = this;
    if(useCameraPlugin){
      // Take a photo
      // Create options for the Camera Dialog
      const options = {
        quality: 100,
        destinationType: self.camera.DestinationType.FILE_URI,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        targetWidth: 1024,
        targetHeight: 1024,
        allowEdit: true,
        cameraDirection: self.camera.Direction.FRONT,
      };
      await self.camera.getPicture(options).then(async (imagePath) => {
        console.log("camera: imagePath: ", imagePath);
        self.photos.push(imagePath);
      }, (err) => {
        console.log('Error: ', err);
      });
    }
    else {
      try{
        const options = {
            maximumImagesCount: 3-self.photos.length,   // remaining (max 3, min 0) images maximum
            width: 1024,                                // 1024px max width
            height: 1024,                               // 1024px max height
            quality: 100,                               // quality 100%
            outputType: 0                               // URI required
        };
        await self.imagePicker.getPictures(options).then( async (resultImages) => {
            // authorization popup makes resultImages to be a string "OK"
            if(typeof resultImages !== "string" && resultImages.length > 0){
                for (let imageURI of resultImages) {
                  console.log("imagePicker: imageURI: ", imageURI);
                    self.photos.push(imageURI);
                }
            }
        }, (error) => {
            console.log(error);
        });
      }catch(error){
          console.log("Error while selecting multiple images : "+error);
      }
    }
    
    //const savedImageFile = await this.savePicture(capturedPhoto);

    // Add new photo to Photos array
    //this.photos.unshift(savedImageFile);

    // Cache all photo data for future retrieval
    /*Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });*/
  }

  // Save picture to file on device
  /*private async savePicture(cameraPhoto: CameraPhoto) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(cameraPhoto);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });

    if (this.platform.is('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }
    else {
      // Use webPath to display the new image instead of base64 since it's 
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: cameraPhoto.webPath
      };
    }
  }*/

  // Read camera photo into base64 format based on the platform the app is running on
  /*private async readAsBase64(cameraPhoto: CameraPhoto) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: cameraPhoto.path
      });

      return file.data;
    }
    else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(cameraPhoto.webPath!);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;  
    }
  }

  // Delete picture by removing it from reference data and the filesystem
  public async deletePicture(photo: Photo, position: number) {
    // Remove this photo from the Photos reference data array
    this.photos.splice(position, 1);

    // Update photos array cache by overwriting the existing photo array
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });

    // delete photo file from filesystem
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: FilesystemDirectory.Data
    });
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });*/
}

/*export interface Photo {
  filepath: string;
  webviewPath: string;
}*/
