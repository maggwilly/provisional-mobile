import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {AppNotify} from './app-notify';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ManagerProvider } from '../providers/manager/manager';
import { HttpModule }    from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
     HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,

    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ManagerProvider
    , AppNotify
  ]
})
export class AppModule {}
