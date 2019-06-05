import { Component ,ViewChild} from '@angular/core';
import { Platform,Nav, Events, } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {UserProvider } from '../providers/user/user';
import * as moment from 'moment';
import { ManagerProvider } from '../providers/manager/manager';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = 'TabsPage';
  constructor(platform: Platform, 
    statusBar: StatusBar,
     splashScreen: SplashScreen,
      public events: Events,
     public manager: ManagerProvider,
      public userService:UserProvider
      ) {
    moment.locale('fr')
    this.events.subscribe('app:connection:change',(status)=>{
      if(status=='connected'){
        this.manager.connected=true
        this.manager.isAscing=true;
        this.manager.ascync().then(()=>{
          this.manager.isAscing=false;
        });
      }
        
    })
    platform.ready().then(() => {
      if(platform.is('cordova')){
        this.userService.getToken();
        this.userService.onNotification();

      }  
      this.userService.getAuthenticatedUser().subscribe(user=>{
        if(user)
        this.events.publish('app:connection:change','connected');
      })
    
       
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }



}

