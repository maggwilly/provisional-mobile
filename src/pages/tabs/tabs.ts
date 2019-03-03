import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UserProvider } from '../../providers/user/user';
/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab2Root: any = 'HomePage';
  tab1Root: any = 'CommendesPage';
  tab3Root: any = 'StatsPage';
  constructor(public navCtrl: NavController, 
    public userService:UserProvider,
    public navParams: NavParams) {
      console.log('ionViewDidLoad TabsPage');
        userService.complete.then(user => {
        console.log(user)
        if (!user||!user.id||!user.parent) {
            userService.go();   
        }else if(user.receiveRequests&&user.receiveRequests.length)  
               userService.request(user.receiveRequests);
         else if(
             (userService.amIMyParent()&&(!user.entreprise||!user.ville||!user.pays))
             ||
             (!userService.amIMyParent()&&(!user.nom))
               )
               userService.profile(user);
          else if( (!user.parent.abonnement||user.parent.abonnement.expired))
               userService.shoulpay(user.parent.abonnement);
      }, (ERROR) => {			
          //loginService.go();
      })     
  }

  ionViewDidLoad() {
   
  }

}
