import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from "@ionic-native/location-accuracy";
import { Network } from '@ionic-native/network';
import { Platform, Events } from 'ionic-angular';
/*
  Generated class for the LocalisationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
declare var Connection;

@Injectable()
export class LocalisationProvider {
  onDevice: boolean;
  lastConnect:boolean=true;
  nbError:number=0;


MAX_POSITION_ERRORS_BEFORE_RESET = 3;
MIN_ACCURACY_IN_METRES = 15000;
positionWatchId = null;
watchpositionErrorCount = 0;
options = {
  maximumAge: 3000, 
  timeout: 15000, 
  enableHighAccuracy: false
};
  constructor(
    public platform: Platform,
    public network: Network,
     public events: Events,
    public diagnostic: Diagnostic,
    private geo: Geolocation,
    public locationAccuracy: LocationAccuracy ) {
      this.network.onConnect().subscribe(() => {
        this.events.publish('app:connection:change','connected');
      });
  }


  getCurrentPosition() {
    return new Promise<Geoposition>((resolve,reject) => {
      if (this.platform.is('core')||this.platform.is('mobileweb')) {
        if ("geolocation" in navigator) {
          this.startWatch().then((position) => { 
                 resolve(position) 
          },error=>{
            reject({message:error.message,source:error})
          });
         }
           else
           reject({message:"Mettez à jour le navigateur pour accéder à la géolocalisation."})
        }       
      else {
          this.diagnostic.isLocationEnabled().then(enabled => {
            const HIGH_ACCURACY = 'high_accuracy';
            if (enabled) {
                this.diagnostic.getLocationMode().then(locationMode => {
                  if (locationMode === HIGH_ACCURACY) {
                    this.geo.getCurrentPosition({ timeout: 30000, maximumAge: 0, enableHighAccuracy: false }).then(pos => {
                      resolve(pos);
                    }, error => {
                      this.startWatch().then(position=>{
                        resolve(position);
                      },er=>reject({message:error.message,source:error}))
                    });
                  } else {
                    this.askForHighAccuracy().then(available => {
                         resolve(available);
                    }, error => {
                      this.startWatch().then(position=>{
                        resolve(position);
                      },er=>reject({message:error.message,source:error}))
                    });
                  }
                });
            } else {
              this.locationAccuracy.canRequest().then((canRequest: boolean) => {
                if(canRequest) {
              this.locationAccuracy.request(1).then(result => {
                if (result) {
                  this.getCurrentPosition().then(result => resolve(result), error => reject(error));
                }
              }, error => {
                console.log(JSON.stringify(error));
                reject({message:"Erreur lors de la requête de permission.",source:error})
              });
            }
            else{
              reject({message:"Impossible de rechercher la position."})
            }
            })
            }
          }, error => {
            console.log(JSON.stringify(error));
            reject({message:"Erreur de plugin ou de droits."})
          });
       
      }
    });
  }
  
  askForHighAccuracy(): Promise<Geoposition> {
    return new Promise<Geoposition>((resolve,reject) => {
      this.locationAccuracy
        .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
          this.geo.getCurrentPosition({ timeout: 30000, maximumAge: 0, enableHighAccuracy: false }).then(
            position => {
              resolve(position);
            }, error => {
              this.startWatch().then(position=>{
                resolve(position);
              },er=>reject({message:error.message,source:error}))
            }
          );
        },  error => {
          this.startWatch().then(position=>{
            resolve(position);
          },er=>reject({message:error.message,source:error}))
        });
    });
  }

  isOnline(): boolean {
    if(this.onDevice && this.network.Connection){
      return this.network.Connection !== Connection.NONE;
    } else {
      return navigator.onLine&&this.lastConnect; 
    }
  }

  isOffline(): boolean {
    if(this.onDevice && this.network.Connection){
      return this.network.Connection === Connection.NONE;
    } else {
      return !navigator.onLine;   
    }
  } 
  
  onConnect(isOnLine:boolean){
    if(!isOnLine&&this.lastConnect){
      this.nbError++;
    }else{
      if(isOnLine){
         this.nbError=0;
         this.lastConnect=isOnLine;
        }
     }
    if(this.nbError>5&&this.lastConnect){
      this.lastConnect=false;
      this.events.publish('last:status',isOnLine);
    }
  }

startWatch(){
 return new Promise<Geoposition>((resolve,reject) => {
  this.positionWatchId = navigator.geolocation.watchPosition((position) => {
     let pos=this.onWatchPositionSuccess(position);
      if(pos)
        resolve(pos);
       }
      ,
       (err) =>{
        let er= this.onWatchPositionError(err);
        if (er) 
        reject({message:er.message,source:er})
       },
   this.options);
  });
}

   onWatchPositionSuccess(position) {
    this.watchpositionErrorCount = 0;
    if(position.coords.accuracy >=this.MIN_ACCURACY_IN_METRES){
      return;        
    }
    // If only single position is required, clear watcher
    this.clearWatch();
    return position;


}

clearWatch(){
  navigator.geolocation.clearWatch(this.positionWatchId);
}

  onWatchPositionError(err) {
    this.watchpositionErrorCount++;
    if (err.code == 3 // TIMEOUT
        && this.watchpositionErrorCount >= this.MAX_POSITION_ERRORS_BEFORE_RESET) {        
          this.clearWatch();
          this.startWatch();
          this.watchpositionErrorCount = 0;
      return;
    }
    return err;
}
}
