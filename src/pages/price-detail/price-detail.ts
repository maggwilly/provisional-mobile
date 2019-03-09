import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';
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
  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public notify: AppNotify,
    public manager: ManagerProvider,
     public navParams: NavParams) {
    this.price=this.navParams.get('price');
    if(!this.price)
      return
    this.payement.price=this.price.id;
  }

  ionViewDidLoad() {
      this.initPayement();
  }
  dismiss(skippecheck=true){
    this.navCtrl.setRoot('TabsPage', {skippecheck:true}, {animate: true, direction: 'forward'}); 
  }

  openUrl(){
   const ch= this.manager.getObservable('payement',this.payement.cmd).subscribe(data=>{
      if(data.json()&&data.json().status&&data.json().status=='SUCCESS') {
        ch.unsubscribe();
       this.dismiss(false);
      }else if(data.json()&&data.json().status&&data.json().status=='FAILED'||!data){
          ch.unsubscribe();
        return this.notify.onError({ message: "Le prelevement n'a pas put etre effectue" });
      }
       
    }, error => {
      this.notify.onError({ message: 'Un problème est survenu. verifiez votre connexion internet' });
})
    // open this.payement.url
  }

  help(){
  let modal=  this.modalCtrl.create('HelpPage',{page:'om'})
  modal.present();
    //this.navCtrl.push('HelpPage',{page:'om'})
  }
  amount(){
    switch (Number(this.payement.duree)) {
      case 1:
        this.payement.cmd=this.oneMonth.cmd
        this.payement.url=this.oneMonth.payment_url;
        this.payement.amount= this.price.amount;
      break;
      case 6:
        this.payement.cmd=this.sixMonth.cmd
        this.payement.url=this.sixMonth.payment_url;
        this.payement.amount= this.price.amount*5; 
      break;     
      default:
        this.payement.cmd=this.twelveMonth.cmd
        this.payement.url=this.twelveMonth.payment_url;
        this.payement.amount=this.price.amount*10; 
      break; 
    }
  }
  public initPayement($event=null){
      if(!this.price)
      return
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