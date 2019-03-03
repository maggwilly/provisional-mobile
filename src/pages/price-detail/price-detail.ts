import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ManagerProvider} from '../../providers/manager/manager';
import { AppNotify } from '../../app/app-notify';
/**
 * Generated class for the PriceDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-price-detail',
  templateUrl: 'price-detail.html',
})
export class PriceDetailPage {
  price:any
  payement:any={duree:"1"};
  oneMonth:any;
  sixMonth:any;
  twelveMonth:any;
  constructor(public navCtrl: NavController,
    public notify: AppNotify,
    public manager: ManagerProvider,
     public navParams: NavParams) {
    this.price=this.navParams.get('price');
    this.payement.price=this.price.id;
  }

  ionViewDidLoad() {
      this.initPayement();
  }


  openUrl(){
    // open this.payement.url
  }

  help(){
    this.navCtrl.push('HelpPage',{page:'om'})
  }
  amount(){
    switch (Number(this.payement.duree)) {
      case 1:
      this.payement.url=this.oneMonth.payment_url;
        this.payement.amount= this.price.amount;
      break;
      case 6:
      this.payement.url=this.sixMonth.payment_url;
      this.payement.amount= this.price.amount*5; 
      break;     
      default:
      this.payement.url=this.twelveMonth.payment_url;
      this.payement.amount=this.price.amount*10; 
      break; 
    }
  }
  public initPayement($event=null){
    this.payement.amount=undefined;
    if (
       Number(this.payement.duree)==1&&this.oneMonth||
       Number(this.payement.duree)==6&&this.sixMonth||
       Number(this.payement.duree)==12&&this.twelveMonth
      ) 
          return this.amount();
    this.manager.post('payement',this.payement).then(data=>{     
      if(!data.payment_url)
        return  this.notify.onError({message:"Le paiement est momentanement indisponible. Reessayez plus tard"})
        switch (data.duree) {
          case 1:
            this.oneMonth=data;
            break;
          case 6:
          this.sixMonth=data;
            break;      
          default:
          this.twelveMonth=data;
            break;
        }
        return this.amount(); 
 },error=>{
   this.notify.onError({message:"PROBLEME ! Verifiez votre connexion internet"})
 })
  }
}