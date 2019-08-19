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
  constructor(
    public platform: Platform,
    public network: Network,
     public events: Events,
    public diagnostic: Diagnostic,
    private geo: Geolocation,
    public locationAccuracy: LocationAccuracy ) {

  }



  getCurrentPosition() {
    return new Promise<Geoposition>((resolve,reject) => {
      console.log(this.platform.platforms()); 
      if (this.platform.is('core')||this.platform.is('mobileweb')) {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition((position) => { 
            resolve(position) 
          },error=>{
            reject({message:"Un problème est survenu durant la géolocalisation par le navigateur. Celà est peut-être lié à votre connexion internet.",source:error})
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
                    this.geo.getCurrentPosition({ timeout: 30000, maximumAge: 0, enableHighAccuracy: true }).then(pos => {
                      resolve(pos);
                    }, error => {
                      reject({message:"Un problème est survenu durant la géolocalisation. Verifier que l'application a accès à votre localisation. Celà est peut aussi être lié à votre connexion internet.",source:error})
                    });
                  } else {
                    this.askForHighAccuracy().then(available => {
                         resolve(available);
                    }, error => {;
                      reject(error)
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
          this.geo.getCurrentPosition({ timeout: 30000, maximumAge: 0, enableHighAccuracy: true }).then(
            position => {
              resolve(position);
            }, error => reject({message:"Un problème est survenu durant la géolocalisation. Verifier que l'application a accès à votre localisation. Celà est peut aussi être lié à votre connexion internet.",source:error})
          );
        }, error => reject({message:"Erreur lors de la requête de permission.",source:error}));
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
}
