import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {AppNotify} from './app-notify';
import { MyApp } from './app.component';
import { ManagerProvider } from '../providers/manager/manager';
import { HttpModule }    from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { UserProvider } from '../providers/user/user';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Geofence } from '@ionic-native/geofence';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { LocalisationProvider } from '../providers/localisation/localisation';
import { Network } from '@ionic-native/network';
import { PipesModule} from '../pipes/pipes.module';
import { DirectivesModule} from '../directives/directives.module';

import {
  GoogleMaps
} from '@ionic-native/google-maps';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp,{
      tabsHideOnSubPages:true
    }),
     HttpModule,
     PipesModule,
     DirectivesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Diagnostic,
    Geofence,
    Geolocation,
    LocationAccuracy,
    GoogleMaps,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ManagerProvider,
     AppNotify,
    LocalisationProvider,
    UserProvider,
    Network,
    Firebase
  ]
})
export class AppModule {}
