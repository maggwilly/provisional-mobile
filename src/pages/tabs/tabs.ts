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
  tab3Root: any = 'DonneesPage';
  constructor(public navCtrl: NavController, 
    public userService:UserProvider,
    public navParams: NavParams) {
       let skippecheck=this.navParams.get('skippecheck')
        userService.resetObserver();
        userService.complete.then(user => {
        if(user&&user.error) 
              return  userService.unavailable();
        else if (!user||!user.id||!user.parent) 
              return userService.go();  
        else if(user.receiveRequests&&user.receiveRequests.length&&!skippecheck)  
              return  userService.request(user.receiveRequests);
        else if(
             (userService.amIMyParent()&&(!user.entreprise||!user.ville||!user.pays)&&!skippecheck)
             ||
             (!userService.amIMyParent()&&(!user.nom)&&!skippecheck)
               )
               return userService.profile(user);
         else if( (!user.parent.abonnement||user.parent.abonnement.expired)&&!skippecheck)
               return userService.shoulpay(user.parent.abonnement);
      }, (ERROR) => {			
      })     
  }

  ionViewDidLoad() {
   
  }

}
