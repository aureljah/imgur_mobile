import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { InAppBrowser, InAppBrowserEventType } from '@ionic-native/in-app-browser/ngx';
import { Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';
import { accountInfo } from '../models/accountInfo';
import { imageInfo } from '../models/imageInfo';

const client_id = "5f5edb6cf60b3bf";
const client_secret = "58eaf9038953015a73b717e19a3c35925e195b4e";

@Injectable({
  providedIn: 'root'
})
export class ImgurApiService {
  access_token: string = undefined;
  account_username: string = undefined;
  account_info: accountInfo = undefined;
  viral_images: imageInfo[] = [];
  account_images: imageInfo[] = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    public iab: InAppBrowser,
    public storage: Storage
  ) { }

  isConnected() {
    if (this.access_token && this.account_username) {
      return true;
    }
    return false;
  }

  logout() {
    this.access_token = undefined;
    this.account_username = undefined;
    this.account_info = undefined;
    this.viral_images = [];
    this.account_images = [];
    this.storage.remove("access_token");
    this.storage.remove("account_username");
    this.router.navigate(["home"]);
  }

  async tryAutoLogin() {
    const self = this;
    let token = await self.storage.get("access_token");
    if (token) {
      let username = await self.storage.get("account_username");
      if (username) {
        this.access_token = token;
        this.account_username = username;

        this.onLoginTask();
        return true;
      }
      return false;
    }
    else {
      return false;
    }
  }

  // put all task/request that need to be done before redirect
  async onLoginTask() {
    const self = this;
    let res_account = await self.request_account_info();
    self.account_info = new accountInfo(self.account_username, res_account);
    console.log(self.account_info);

    self.load_viral_images();

    self.reload_account_images();
  }

  login() {
    const self = this;
    return new Promise<any>((resolve, reject) => {
      this.authorize_account().then(async (res) => {
        console.log("authorize_account: RESOLVED !");
        self.storage.set("access_token", self.access_token);
        self.storage.set("account_username", self.account_username);

        await self.onLoginTask();

        resolve(true);
      }).catch((err) => {
        console.error("authorize_account: REJECTED !");
        resolve(false);
      });
    });
  }

  authorize_account() {
    return new Promise<any>((resolve, reject) => {
      let resolved = false;
      let browser = this.iab.create("https://api.imgur.com/oauth2/authorize?client_id="+client_id+"&response_type=token", "_blank", "clearcache=yes");
      let sub = browser.on("loadstart").subscribe((params) => {
        console.log("loadstart: params: ", params);
        if (params && params.url && params.url.includes("access_token")) {
          // extract access_token
          this.access_token = this.extract_from_url(params.url, "access_token");
          console.log("authorize_account: found access_token: ", this.access_token);
          // extract refresh_token ?
          let refresh_token = this.extract_from_url(params.url, "refresh_token");
          console.log("authorize_account: found refresh_token: ", refresh_token);
          // extract account_username
          this.account_username = this.extract_from_url(params.url, "account_username");
          console.log("authorize_account: found account_username: ", this.account_username);
          // exctract account_id ?
          let account_id = this.extract_from_url(params.url, "account_id");
          console.log("authorize_account: found account_id: ", account_id);

          /* exemple success url
              https://imgur.com/#access_token=f23e82b4e0b7d14d43dc8fbbdd7b6eb145decd95&expires_in=315360000&token_type=bearer&refresh_token=8ee853a9b0602be54953064a9a186868ba2c1a3d&account_username=Aureljah&account_id=142233583
          */

          this.request_account_info()

          //sub.unsubscribe();
          resolved = true;
          browser.close();
          resolve();
        }
        else if (params.url.includes("error")) {
          // probably refused access
          //sub.unsubscribe();
          resolved = true;
          browser.close();
          reject();
        }
      });
      let sub_exit = browser.on("exit").subscribe((params) => {
        sub.unsubscribe();
        sub_exit.unsubscribe();
        console.log("exit: params: ", params);
        if (resolved === false) {
          reject();
        }
      });
      /*browser.on("loadstop").subscribe((params) => {
        console.log("loadstop: params: ", params);
      });
      browser.on("loaderror").subscribe((params) => {
        console.log("loaderror: params: ", params);
      });*/
    });
  }

  extract_from_url(url: string, key: string) {
    let value = undefined;
    if (url.includes(key)) {
      let idx = url.indexOf(key);
      if (idx !== -1) {
        let idx_start = (idx + key.length + 1);
        let idx_end = url.indexOf("&", idx_start);
        if (idx_end === -1) {  // no separator found, so should be the last
          value = url.substring(idx_start);
        }
        else {
          value = url.substring(idx_start, idx_end);
        }
      }
    }
    return value;
  }

  async load_viral_images(page: number = 0) {
    let gallery = await this.request_get_viral_images(page);
    console.log("request_get_viral_images: res: ", gallery);
    if (gallery && gallery.data) {
      let img_list: imageInfo[] = [];
      for (let i = 0 ; i < gallery.data.length ; i++) {
        let elem = gallery.data[i];
        let img = new imageInfo(elem);
        if (img.animated !== true) {
          img_list.push(img);
        }
      }
      this.viral_images = img_list;
    }
  }

  async reload_account_images() {
    let res = await this.request_all_account_images();
    console.log("request_all_account_images: ", res);
    if (res && res.data) {
      let img_list: imageInfo[] = [];
      for (let i = 0 ; i < res.data.length ; i++) {
        let elem = res.data[i];
        let img = new imageInfo(elem);
        if (img.animated !== true) {
          img_list.push(img);
        }
      }
      this.account_images = img_list;
    }
  }

  // Authorization: Bearer YOUR_ACCESS_TOKEN
  request_all_account_images(page: number = 0) {
    return new Promise<any>((resolve, reject) => {
        this.http.get("https://api.imgur.com/3/account/"+this.account_username+"/images/" + page.toString(), {headers: {Authorization: "Bearer " + this.access_token}}).pipe(
        ).subscribe(response => {
            resolve(response);
        }, error => {
            reject(error);
        });
    });
  }

  request_get_viral_images(page: number = 0) {
    return new Promise<any>((resolve, reject) => {
        this.http.get("https://api.imgur.com/3/gallery/hot/viral/day/" + page.toString(), {headers: {Authorization: "Client-ID " + client_id}}).pipe(
        ).subscribe(response => {
            resolve(response);
        }, error => {
            reject(error);
        });
    });
  }

  request_upload_image(img, type: string, name: string, title: string, description: string) {
    return new Promise<any>((resolve, reject) => {
      this.http.post("https://api.imgur.com/3/image", {image: img, type: type, name: name, title: title, description: description}, {headers: {Authorization: "Bearer " + this.access_token}}).pipe(
      ).subscribe(response => {
        resolve(response);
      }, error => {
        reject(error);
      });
    });
  }

  // Account: Acount Base info
  request_account_info() {
    return new Promise<any>((resolve, reject) => {
      this.http.get("https://api.imgur.com/3/account/" + this.account_username, {headers: {Authorization: "Client-ID " + client_id}}).pipe(
      ).subscribe(response => {
        this.account_info = new accountInfo(this.account_username, response);
        resolve(response);
      }, error => {
        reject(error);
      });
    });
  }
};
