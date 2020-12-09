import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { InAppBrowser, InAppBrowserEventType } from '@ionic-native/in-app-browser/ngx';

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
      let sub = browser.on("beforeload").subscribe((params) => {
        console.log("beforeload: params: ", params);
        if (params.url.includes("access_token")) {
          // extract acces_token
          // extract refresh_token ?
          // extract account_username
          // exctract account_id ?
          sub.unsubscribe();
          browser.close();
          resolve();
        }
        else if (params.url.includes("error")) {
          // probably refused access
          sub.unsubscribe();
          browser.close();
          reject();
        }
      });
    });
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
