import { Injectable } from '@angular/core';
import { Http, Headers, } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Events } from 'ionic-angular';
import { Config } from "../../app/config";
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
/*
  Generated class for the ManagerProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ManagerProvider {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  date: any;
  //baseUrl: string = 'http://localhost:8000';
  constructor(public http: Http, public storage: Storage, public events: Events) {
    this.headers.set('X-User-Id',this.getUserId())
    
  }

  clearStorage() {
    //this.storage.clear();    
  }

  storeUser(user: any) {
    window.localStorage.setItem('_user_id_', user.id);
   return this.storage.set('user',user)
  }

  getUserId(): string {
    let _user_id = window.localStorage.getItem('_user_id_');
    return _user_id;
  }

  getUserVille(): string {
    let _user_region = window.localStorage.getItem('_user_region');
    return _user_region;
  }


  getAuToken(): string {
    let token = window.localStorage.getItem('_token_id');
    return token;
  }

  find(entityName:any,keyname:string, keyvalue:string) {
    return this.http.get(Config.server +'/'+entityName+ '/find/json?keyname='+keyname+'&keyvalue='+keyvalue, { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }

  get(entityName:any) {
    return this.http.get(Config.server +'/'+entityName+ '/json', { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }

  getText(prefix:string,suffix:string='') {
    return this.http.get(Config.server +'/'+prefix+suffix , { headers: this.headers })
      .toPromise()
      .then(response => response.text());
  }


  show(entityName:any,entityid) {
    return this.http.get(Config.server + '/'+entityName+'/'+entityid+'/show/json?id='+entityid, { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }

  post(entityName:any,entity:any,action:string='new') {
    console.log(JSON.stringify(entity));
    return this.http.post(Config.server + '/'+entityName+'/'+action+'/json',JSON.stringify(entity), { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }

  put(entityName:any,entity:any) {
    return this.http.put(Config.server + '/'+entityName+'/'+entity.id+'/edit/json',JSON.stringify(entity), { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }


 save(entityName:any,entity:any){
 if(entity.id)
   return this.put(entityName,entity);
return this.post(entityName,entity);
}



  delete(entityName:any,entity:any, target:string='delete') {
    return this.http.delete(Config.server + '/'+entityName+'/'+entity.id+'/'+target+'/json?id='+entity.id ,{ headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }

  getObservable(entityName:any,entityid) {
    return IntervalObservable
      .create(1000)
      .flatMap((i) => this.http.get(Config.server + '/'+entityName+'/'+entityid+'/show/json?id='+entityid, { headers: this.headers }));
}
}

