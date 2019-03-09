import { Injectable } from '@angular/core';
//import { Component } from '@angular/core';
import {  ToastController, ToastOptions,AlertOptions, AlertController ,LoadingController,LoadingOptions, Loading} from 'ionic-angular';

@Injectable()
export class AppNotify {

  constructor(
    private toastCtrl: ToastController,
     private alerttCtrl: AlertController,
      public loadingCtrl: LoadingController,
  ) {
    this.toastCtrl = toastCtrl;
  }

  onSuccess(toastOpts: ToastOptions) {

    let succesToast = this.toastCtrl.create({
      message: toastOpts.message,
      duration: toastOpts.duration || 3000,
      position: toastOpts.position || 'bottom',
      showCloseButton: toastOpts.showCloseButton || true,
      cssClass: 'danger',
    });
    succesToast.present();

  }

  onError(toastOpts: ToastOptions) {

    let errorToast = this.toastCtrl.create({
      message: toastOpts.message,
      duration: toastOpts.duration || 7000,
      position: toastOpts.position || 'bottom',
      showCloseButton: toastOpts.showCloseButton || true,
      cssClass: 'success',
    });

    errorToast.present();

  }

    showAlert(alertOptions: AlertOptions) {
    let errorToast = this.alerttCtrl.create({
      message: alertOptions.message,
      title:alertOptions.title,
      subTitle:alertOptions.subTitle,
      buttons:alertOptions.buttons||['Ok'],
       inputs:alertOptions.inputs||[]
    });

    errorToast.present();
  }

  loading(loadingOptions:LoadingOptions):Loading{
    return this.loadingCtrl.create(loadingOptions);
  }
}
