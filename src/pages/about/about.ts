import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController} from 'ionic-angular';
import { ManagerProvider} from '../../providers/manager/manager';
/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  text:string
  constructor(public navCtrl: NavController,
     public manager: ManagerProvider,
     public viewCtrl: ViewController,
     public navParams: NavParams) {
  }

dismiss(){
  this.viewCtrl.dismiss()
  //this.navCtrl.setRoot('TabsPage', {skippecheck:true}, {animate: true, direction: 'forward'}); 
}
  ionViewDidLoad() {
    this.manager.getText('help.','abaout.html').then(text=>{
      this.text=text;
    })
  
  }

}
