import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, MenuController } from 'ionic-angular';
import {UserProvider } from '../../providers/user/user';
/**
 * Generated class for the PopOverMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pop-over-menu',
  templateUrl: 'pop-over-menu.html',
})
export class PopOverMenuPage {
   navCtrl: NavController;
   menu:MenuController
   user:any;
  pages:any[]=[
    {name:'A propos', component:'AboutPage'},
    {name:'Mon profil', component:'ProfilePage'}
  ]
  constructor(
   
    public viewCtrl: ViewController, 
    public navParams: NavParams ,
    public userService:UserProvider) {
     this. navCtrl=this.navParams.get('navCtrl')
     this. menu=this.navParams.get('menu')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopOverMenuPage');
  }
  openPage(p:any){
    this.viewCtrl.dismiss();
    this.menu.close()
    this.navCtrl.push(p.component,{user:this.userService.user})
  }

  logout(){
     this.viewCtrl.dismiss();
   this.userService.logout();
  }
}
