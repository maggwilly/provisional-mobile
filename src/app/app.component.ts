import { Component ,ViewChild} from '@angular/core';
import { Platform,Nav, } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {UserProvider } from '../providers/user/user';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = 'TabsPage';
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public userService:UserProvider) {
    platform.ready().then(() => {
      if(platform.is('cordova')){
        this.userService.getToken();
        this.userService.onNotification();
      }    
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }



}

