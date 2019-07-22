import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events, } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserProvider } from '../providers/user/user';
import * as moment from 'moment';
import { ManagerProvider } from '../providers/manager/manager';
import { Geofence } from '@ionic-native/geofence';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = 'MenuPage';
  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private geofence: Geofence,
    public events: Events,
    public manager: ManagerProvider,
    public userService: UserProvider
  ) {
    moment.locale('fr')
    platform.ready().then(() => {
      if (platform.is('cordova')) {
        this.userService.getToken();
        this.userService.onNotification();
        this.geofence.initialize().then(
          () => this.addGeofence(),
          (err) => console.log(err)
        )
        this.geofence.onTransitionReceived().subscribe(data => {
             console.log(data) /// sent t the server
        })
      }
      this.events.subscribe('app:connection:change', (status) => {
        if (status == 'connected') {
          this.manager.connected = true
          this.manager.isAscing = true;
          this.manager.ascync().then(() => {
            this.manager.isAscing = false;
          });
        }
      })
      this.userService.getAuthenticatedUser().subscribe(user => {
        if (user)
          this.events.publish('app:connection:change', 'connected');
      })
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  private addGeofence() {
    this.userService.getAuthenticatedUser().subscribe(user => {
      if (user && user.secteur) {
        let fence = {
          id: user.secteur.id, //any unique ID
          latitude: user.secteur.lat, //center of geofence radius
          longitude: user.secteur.long,
          radius: user.secteur.radius, //radius to edge of geofence in meters
          transitionType: 3, //see 'Transition Types' below
          notification: { //notification settings
            id: 1, //any unique ID
            title: 'Changement de zone', //notification title
            text: 'Vous venez de changer de zone.', //notification body
            openAppOnClick: true //open app when notification is tapped
          }
        }
        this.geofence.addOrUpdate(fence).then(
          () => console.log('Geofence added'),
          (err) => console.log('Geofence failed to add')
        );
      }
    })
  }
}

