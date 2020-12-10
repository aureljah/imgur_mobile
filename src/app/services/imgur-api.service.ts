import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { InAppBrowser, InAppBrowserEventType } from '@ionic-native/in-app-browser/ngx';
import { strict } from 'assert';

const client_id = "5f5edb6cf60b3bf";
const client_secret = "58eaf9038953015a73b717e19a3c35925e195b4e";

@Injectable({
  providedIn: 'root'
})
export class ImgurApiService {
  access_token: string = undefined;
  account_username: string = undefined;

  constructor(
    public http: HttpClient,
    public iab: InAppBrowser
  ) { }

  isConnected() {
    if (this.access_token && this.account_username) {
      return true;
    }
    return false;
  }

  authorize_account() {
    return new Promise<any>((resolve, reject) => {
      let browser = this.iab.create("https://api.imgur.com/oauth2/authorize?client_id="+client_id+"&response_type=token");
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

          //sub.unsubscribe();
          browser.close();
          resolve();
        }
        else if (params.url.includes("error")) {
          // probably refused access
          //sub.unsubscribe();
          browser.close();
          reject();
        }
      });
      let sub_exit = browser.on("exit").subscribe((params) => {
        sub.unsubscribe();
        sub_exit.unsubscribe();
        console.log("exit: params: ", params);
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
}
