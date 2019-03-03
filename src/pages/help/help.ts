import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ManagerProvider} from '../../providers/manager/manager';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the HelpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {
  page:string;
  text:string;
  constructor(public navCtrl: NavController,
    public manager: ManagerProvider,
    public storage: Storage,
     public navParams: NavParams) {
    this.page=this.navParams.get('page');
  }

  ionViewDidLoad() {
    this.manager.getText('help/',this.page+'.html').then(text=>{
      this.text=text;
    })
  
  }

}
