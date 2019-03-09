import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController} from 'ionic-angular';
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
   user:any;
  pages:any[]=[
    {name:'A propos', component:'AboutPage'},
    {name:'Mon profil', component:'ProfilePage'}
  ]
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController, 
    public navParams: NavParams ,
    public userService:UserProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopOverMenuPage');
  }
  openPage(p:any){
    this.viewCtrl.dismiss();
    this.navCtrl.push(p.component,{user:this.userService.user})
  }

  logout(){
     this.viewCtrl.dismiss();
   this.userService.logout();
  }
}
