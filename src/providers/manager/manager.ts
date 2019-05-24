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
  private keys:string[]
  //baseUrl: string = 'http://localhost:8000';
  constructor(public http: Http, public storage: Storage, public events: Events) {
    // console.log(window.localStorage.getItem('_user_token'));
    this.headers.set('X-Auth-Token', window.localStorage.getItem('_user_token'))
   //this.onConnect();
  }

  clearStorage() {
    //this.storage.clear();    
  }

  storeUser(user: any) {
    return this.storeEntity('user', user).then(()=>{
      window.localStorage.setItem('_user_id_', user.id);
      window.localStorage.setItem('_user_token', user.apiKey);
      this.headers.set('X-Auth-Token', user.apiKey)
    })
  }

  getUserId(): string {
    let _user_id = window.localStorage.getItem('_user_id_');
    return _user_id;
  }

  get(entityName: any) {
  return new Promise<any>((resolve,reject)=>{
    return this.http.get(`${Config.server}/${entityName}/json`, { headers: this.headers })
    .toPromise()
    .then(response =>{
      return this.storeEntity(entityName,response.json()).then(()=>
         this.getEntityLocal(entityName).then(entites=>resolve(entites)))
    },error=>{
        return  this.getEntityLocal(entityName).then(entites=>resolve(entites));
    } );
    })
  }



  getText(prefix: string, suffix: string = '') {
    return this.http.get(Config.server + '/' + prefix + suffix, { headers: this.headers })
      .toPromise()
      .then(response => response.text());
  }


  show(entityName: any, entityid) {
    return new Promise<any>((resolve,reject)=>{
      return this.http.get(`${Config.server }/${entityName} /${entityid}/show/json?id=${entityid}`, { headers: this.headers })
      .toPromise()
      .then(response =>{
       this.storeEntity(entityName,response.json()).then(()=> resolve(response.json()))  
      },error=>{
        return this.storage.get(`${entityName}_id_${entityid}`).then(data=>{
          resolve(data)
        })
      });
    })
  }
  
  storeEntity(entityName: any,data:any){
    if(!Array.isArray(data))
     return  this.storage.set(`${entityName}_id_${data.id}`,data)
     let promises:Promise<any>[]=[];
     data.forEach(element => {
      promises.push(this.storeEntity(entityName,element)) 
     }
   )
     return  Promise.all(promises);
  }

getEntityLocal(entityName: any){
return new Promise<any>((resolve,reject)=>{
  let entities:any[]=[];
  this.storage.forEach((value, key, index) => {
    if (key.match(`^${entityName}+_(id|new)_(([a0-z9]-*)(?!.*[_]deleted$))*$`)) {
      entities.push(value);  
    }     
   resolve(entities)
  }) 
})
}


  post(entityName: any, entity: any, action: string = 'new') {
    return new Promise<any>((resolve,reject)=>{
      this.storeEntity(entityName,entity).then(() => {
         this.http.post(Config.server + '/' + entityName + '/' + action + '/json', JSON.stringify(entity), { headers: this.headers })
        .toPromise()
        .then(response => {
          return this.storeEntity(entityName,response.json()).then(()=> resolve(response.json()))
        },error=>{
          resolve (entity)
        })
      })
    })

  }

  put(entityName: any, entity: any) {
    return new Promise<any>((resolve,reject)=>{
      return this.storeEntity(entityName,entity).then(() => {
         this.http.put(`${Config.server }/${entityName}/${entity.id}/edit/json`, JSON.stringify(entity), { headers: this.headers })
        .toPromise()
        .then(response => {
          return resolve (response.json())
        },error=>{
          resolve (entity)
        })
      })
    })  

  }


  save(entityName: any, entity: any) {
    if (entity.id)
      return this.put(entityName, entity);
      entity.id = Guid.create().toString();
    return this.post(entityName, entity);
  }


  onConnect() {
   return this.storage.keys().then((keys)=>{
      this.keys=keys;
    })
   /* return this.storage.forEach((value, key, index) => {
      if (key.match("^[a-z]+_(id|new)_(([a0-z9]-*)(?!.*[_]deleted$))*$")||key.match("^[a-z]+_(id|new)_[a0-z9]*_deleted$")) {
        //let keys_parts = key.split("_", 3);
        console.log(key,value);
       // this.save(keys_parts[0], value)
      }
    })*/
  }


  delete(entityName: any, entity: any, target: string = 'delete') {
   return  new Promise<any>((resolve,reject)=>{
    let promises: Promise<any>[]=[];
     this.storage.forEach((value,key,index)=>{
      if (key.match(`^${entityName}_(id|new)_${entity.id}$`)){
         promises.push(this.storage.remove(`${entityName}_id_${entity.id}`))
         promises.push(this.storage.set(`${key}_deleted`,value))
      }
     })
     return  Promise.all(promises).then(()=>{
      return this.http.delete(`${Config.server}/${entityName}/${entity.id}/${target}/json?id=${entity.id}`, { headers: this.headers })
      .toPromise()
      .then(response =>{
        this.storage.remove(`${entityName}_id_${entity.id}_deleted`)
        return resolve(response.json())
      } ,error=>{
        resolve({ok:true,deletedId:entity.id})
      });})
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

