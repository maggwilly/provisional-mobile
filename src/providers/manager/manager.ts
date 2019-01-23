import { Injectable } from '@angular/core';
import { Http, Headers, } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Events } from 'ionic-angular';
import { DatePipe } from "@angular/common";
/*
  Generated class for the ManagerProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ManagerProvider {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  date: any;
  baseUrl: string = 'https://dbs-web.herokuapp.com/v1/mobile';
  constructor(public http: Http, public storage: Storage, public events: Events) {
    console.log('Hello Manager Provider');
    let nowDate = new Date();
    var datePipe = new DatePipe('en');
    this.date = datePipe.transform(nowDate, 'yyyy-MM-dd');
  }
  storeUserCredentials(token) {
    window.localStorage.setItem('_token', token);
  }


  clearStorage() {
    //this.storage.clear();    
  }

  storeUser(user: any) {
    window.localStorage.setItem('_user_id', user.id);
    window.localStorage.setItem('_user_region', user.ville);
  }

  getUserId(): string {
    let _user_id = window.localStorage.getItem('_user_id');
    return _user_id;
  }

  getUserVille(): string {
    let _user_region = window.localStorage.getItem('_user_region');
    return _user_region;
  }


  getAuToken(): string {
    let token = window.localStorage.getItem('_token');
    return "token";
  }

  getPointVentes() {
    return this.http.get(this.baseUrl + '/points/ventes/' + this.getUserId()+'/json', { headers: this.headers })
      .toPromise()
      .then(response => response.json())
  }

  getProduits() {
    return this.http.get(this.baseUrl + '/produits', { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }

  getCommendes(pointVente:any) {
    return this.http.get(this.baseUrl + '/commende/'+pointVente.id+'/json', { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }

  postCommende(commende:any) {
    return this.http.post(this.baseUrl + '/commende/json',JSON.stringify(commende), { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }



  getCommendesTest(pointVente:any) {
    return this.http.get('assets/data/commendes.json', { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }
  getPointVentesTest() {
    return this.http.get('assets/data/pointVentes.json', { headers: this.headers })
      .toPromise()
      .then(response =>  response.json()); 
  }

  getProduitsTest(load: any = true) {
    if (!load)
      return;
    return this.http.get('assets/data/produits.json', { headers: this.headers })
      .toPromise()
      .then(response =>response.json());
  }


  authenticate(credentials: any) {
    return this.http.post(this.baseUrl + '/create/auth-token', JSON.stringify(credentials), { headers: this.headers })
      .toPromise()
      .then(response => {
        if (response) {
          this.storeUserCredentials(response.json().value);
          this.storeUser(response.json().user);
          this.events.publish('login:success');
        } else
          this.events.publish('login:error');
        return true;
      })
      .catch(error => {
        this.events.publish('login:error');
        return false;
      })

  }
}

