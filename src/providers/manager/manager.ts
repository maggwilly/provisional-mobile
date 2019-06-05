import { Injectable } from '@angular/core';
import { Http, Headers, } from '@angular/http';

import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Events } from 'ionic-angular';
import { Config } from "../../app/config";
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { Guid } from "guid-typescript";
@Injectable()
export class ManagerProvider {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  public keys:any[]=[];
  public isAscing:boolean=false;
  public connected: boolean = true;
  //baseUrl: string = 'http://localhost:8000';
  constructor(public http: Http, public storage: Storage, public events: Events) {
    // console.log(window.localStorage.getItem('_user_token'));
    this.headers.set('X-Auth-Token', window.localStorage.getItem('_user_token'))
    this.storage.keys().then((keys)=>{
      this.keys=keys;
    })
   this.listenEvents();
   //this.clearStorage()
  }

  clearStorage() {
    this.storage.clear();    
  }
  listenEvents() {
    Config.entityNames.forEach(entityName => {
      this.events.subscribe(`entity:${entityName}:change`, (data) => {
        if(data&&data.change)
        this.save(entityName, data, this.connected);
      })
    })
   

  }

  ascync(){
    let promises:any[]=[];
    promises.push(this.saveAscyncEntity())
    promises.push(this.deletAascyncEntity())
    promises.push(this.getAascyncEntity())
    return Promise.all(promises);
  }




saveAscyncEntity(){
  let promises:any[]=[];
  Config.entityNames.map(entityName => {
    this.storage.forEach((value, key, index) => {
      if (key.match(`^${entityName}+_(id|new)_(([a0-z9]-*)(?!.*[_]deleted$))*$`)) {
        if(value&&value.change)
         return promises.push(this.save(entityName, value,this.connected)) 
      }
    })
  })
 return Promise.all(promises)
}

deletAascyncEntity(){
  let promises:any[]=[];
  Config.entityNames.map(entityName => {
    this.storage.forEach((value, key, index) => {
      if (key.match(`^${entityName}+_(id|new)_[a0-z9]*_deleted$`))  {
        if(value&&value.change)
         return promises.push(this.delete(entityName, value, 'delete',this.connected)) 
      }
    })
  })
 return Promise.all(promises)
}

getAascyncEntity(){
  let promises:any[]=[];
  Config.entityNames.map(entityName => {
    promises.push(this.get(entityName,true))
  })
 return Promise.all(promises)
}

  storeUser(user: any) {
    return this.storeEntityLocally('user', user).then(() => {
      window.localStorage.setItem('_user_id_', user.id);
      window.localStorage.setItem('_user_token', user.apiKey);
      this.headers.set('X-Auth-Token', user.apiKey)
    })
  }

  removeUser() {
    return this.storage.clear().then(() => {
      window.localStorage.clear();
      this.headers.delete('X-Auth-Token')
    })
  }

  getUserId(): string {
    let _user_id = window.localStorage.getItem('_user_id_');
    return _user_id;
  }

  get(entityName: any, online?: boolean) {
    if (online)
      return new Promise<any>((resolve, reject) => {
        let keys=this.arrayKeys(entityName);
        console.log(`${Config.server}/${entityName}/json?keys=${keys}`);
        
        return this.http.get(`${Config.server}/${entityName}/json?keys=${keys}`, { headers: this.headers })
          .toPromise()
          .then(response => {
            return this.storeEntityLocally(entityName, response.json()).then(() =>
                     this.getEntitieLocally(entityName).then(entites => {
                       resolve(entites)}))
          }, error =>
           {
             console.log(error);
             
             reject(error)
            });
      })
    return this.getEntitieLocally(entityName);
  }

  arrayKeys(entityName):string{
  let keysString:string=''
  let localkeys=  this.keys.filter(key=>{return key.match(`^${entityName}+_(id|new)_(([a0-z9]-*)(?!.*[_]deleted$))*$`)});
  localkeys.forEach((key:string)=>{
    let keyparts=key.split('_',3);
    keysString=`${keysString}.${keyparts[2]}`
    
  })
  
   return keysString; 
  }

  getText(prefix: string, suffix: string = '') {
    return this.http.get(Config.server + '/' + prefix + suffix, { headers: this.headers })
      .toPromise()
      .then(response => response.text());
  }


  show(entityName: any, entityid, online?: boolean) {
    if (online)
      return new Promise<any>((resolve, reject) => {
        return this.http.get(`${Config.server}/${entityName}/show/json?id=${entityid}`, { headers: this.headers })
          .toPromise()
          .then(response => {
            let data=response.json();
            data.change=undefined;
            this.storeEntityLocally(entityName, data).then((data) => {resolve(data)})
          }, error => {reject(error)});
      })
    return this.getEntitieLocally(entityName, entityid)
  }




  storeEntityLocally(entityName: any, data: any, changes?: boolean) {
    return new Promise<any>((resolve, reject) => {
      if (!Array.isArray(data))
        return this.storage.set(`${entityName}_id_${data.id}`, data).then(() => {
          if (changes && this.connected)
            this.events.publish(`entity:${entityName}:change`, data)
          resolve(data)
        })
      let promises: Promise<any>[] = [];
      data.forEach(element => {
        promises.push(this.storeEntityLocally(entityName, element))
      }
      )
      return Promise.all(promises).then(() => {
        this.events.publish(`loaded:${entityName}:new`)
        resolve(data)
      })
    })
  }

  getEntitieLocally(entityName: any, id?: any) {
    if (id)
      return this.storage.get(`${entityName}_id_${id}`)
    return new Promise<any>((resolve, reject) => {
      let entities: any[] = [];
      this.storage.forEach((value, key, index) => {
        if (key.match(`^${entityName}+_(id|new)_(([a0-z9]-*)(?!.*[_]deleted$))*$`)) {
          entities.push(value);
        }
        resolve(entities)
      })
    })
  }


  post(entityName: any, entity: any, action: string = 'new', online?: boolean) {
    if (online)
    return new Promise<any>((resolve, reject) => {
      console.log(Config.server + '/' + entityName + '/' + action + '/json');
     this.http.post(Config.server + '/' + entityName + '/' + action + '/json', JSON.stringify(entity), { headers: this.headers })
        .toPromise()
        .then(response => {
          this.keys.push(`${entityName}_id_${entity.id}`);
          return this.storeEntityLocally(entityName,response.json()).then(() => {resolve(response.json())})
        }, error =>{
          console.log(error);
          reject(error)} )
      })
    return this.storeEntityLocally(entityName, entity, true)
  }

  put(entityName: any, entity: any, online?: boolean) {
    if (online)
      return new Promise<any>((resolve, reject) => {
        console.log(`${Config.server}/${entityName}/${entity.id}/edit/json`);
        console.log(JSON.stringify(entity));
        this.http.put(`${Config.server}/${entityName}/${entity.id}/edit/json`, JSON.stringify(entity), { headers: this.headers })
          .toPromise()
          .then(response => {
            return this.storeEntityLocally(entityName,response.json() ).then(() => {resolve(response.json())})
          }, error => reject(error))
      })
    return this.storeEntityLocally(entityName, entity, true)

  }


  save(entityName: any, entity: any, online?: boolean) {
    if(!entity.change)
    return new Promise<any>((resolve, reject) => {
      resolve(entity)
    })
    if (entity.change&&entity.stored&&entity.id)
      return this.put(entityName, entity, online);
    if(!entity.id)
      entity.id = Guid.create().toString();
    return this.post(entityName, entity, 'new', online);
  }



  delete(entityName: any, entity: any, target: string = 'delete', online?: boolean) {
    if (online)
      return new Promise<any>((resolve, reject) => {
        this.http.delete(`${Config.server}/${entityName}/${entity.id}/${target}/json?id=${entity.id}`, { headers: this.headers })
          .toPromise()
          .then(response => {
            this.storage.remove(`${entityName}_id_${entity.id}_deleted`)
            return resolve(response.json())
          })
      })
    return new Promise<any>((resolve, reject) => {
      let promises: Promise<any>[] = [];
      promises.push(this.storage.remove(`${entityName}_id_${entity.id}`))
      promises.push(this.storage.set(`${entityName}_id_${entity.id}_deleted`, entity))
      return Promise.all(promises)
    })

  }

  getObservable(entityName: any, entityid) {
    return IntervalObservable
      .create(1000)
      .flatMap((i) => this.http.get(Config.server + '/' + entityName + '/' + entityid + '/show/json?id=' + entityid, { headers: this.headers }));
  }


  getQuartiers() {
    return this.http.get('assets/data/quartiers.json')
      .toPromise()
      .then(res => res.json());
  }
}

