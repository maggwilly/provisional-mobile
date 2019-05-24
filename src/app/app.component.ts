import { Component ,ViewChild} from '@angular/core';
import { Platform,Nav, } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {UserProvider } from '../providers/user/user';
import * as moment from 'moment';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = 'TabsPage';
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public userService:UserProvider) {
    moment.locale('fr'/*, {
			relativeTime: {
				future: 'now',
				past: '%s',
				s: 'now',
				m: '1 m',
				mm: '%d m',
				h: '1 h',
				hh: '%d h',
				d: '1 d',
				dd: '%d d',
				M: '1 m',
				MM: '%d m',
				y: '1 y',
				yy: '%d y'
      }
		}*/)
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

