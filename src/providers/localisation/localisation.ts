import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from "@ionic-native/location-accuracy";
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';
/*
  Generated class for the LocalisationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
declare var Connection;

@Injectable()
export class LocalisationProvider {
  onDevice: boolean;
  constructor(
    public platform: Platform,
    public network: Network,
    public diagnostic: Diagnostic,
    private geo: Geolocation,
  
    public locationAccuracy: LocationAccuracy ) {
    console.log('Hello LocalisationProvider Provider');
  }
  getCurrentPosition() {
    return new Promise<Geoposition>((resolve,reject) => {
      const HIGH_ACCURACY = 'high_accuracy';
      if (this.platform.is('cordova')) {
        this.platform.ready().then(() => {
          this.diagnostic.isLocationEnabled().then(enabled => {
            if (enabled) {
              if (this.platform.is('android')) {
                this.diagnostic.getLocationMode().then(locationMode => {
                  if (locationMode === HIGH_ACCURACY) {
                    this.geo.getCurrentPosition({ timeout: 30000, maximumAge: 0, enableHighAccuracy: true }).then(pos => {
                      resolve(pos);
                    }).catch(error => reject(error));
                  } else {
                    this.askForHighAccuracy().then(available => {
                      if (available) {
                        this.getCurrentPosition().then(a => resolve(a), e => resolve(e));
                      }
                    }, error => reject(error));
                  }
                });
              } else {
                this.geo.getCurrentPosition({ timeout: 30000, maximumAge: 0, enableHighAccuracy: true }).then(pos => {
                  resolve(pos);
                }).catch(error => reject(error));
              }
            } else {
              this.locationAccuracy.canRequest().then((canRequest: boolean) => {
                if(canRequest) {
              this.locationAccuracy.request(1).then(result => {
                if (result) {
                  this.getCurrentPosition().then(result => resolve(result), error => reject(error));
                }
              }, error => {
                reject(error)
              });
            }
            else{
              reject('Un Pb empèche de rechercher la position du device')
            }
            })
            }
          }, error => {
            reject(error)
          });
        });
      } else {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition((position) => { 
            resolve(position) 
          });
         }
         else
        this.geo.getCurrentPosition({ timeout: 30000, maximumAge: 0, enableHighAccuracy: true }).then((resp) => resolve(resp) );
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
            }, error => reject(error)
          );
        }, error => reject(error));
    });
  }

  isOnline(): boolean {
    if(this.onDevice && this.network.Connection){
      return this.network.Connection !== Connection.NONE;
    } else {
      return navigator.onLine; 
    }
  }

  isOffline(): boolean {
    if(this.onDevice && this.network.Connection){
      return this.network.Connection === Connection.NONE;
    } else {
      return !navigator.onLine;   
    }
  }  
}
