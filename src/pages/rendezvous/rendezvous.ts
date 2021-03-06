import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ManagerProvider} from '../../providers/manager/manager';
import { AppNotify } from '../../app/app-notify';
import { DatePipe } from "@angular/common";
/**
 * Generated class for the RendezvousPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rendezvous',
  templateUrl: 'rendezvous.html',
})
export class RendezvousPage {
   rendezvous:any={}
   users:any[]=[]
   pointVente: any = {};
  constructor(
    public navCtrl: NavController,
    public manager: ManagerProvider,
    public viewCtrl: ViewController,
    public notify: AppNotify,
    public navParams: NavParams) {
    this.rendezvous=this.navParams.get('rendezvous');
    this.pointVente = navParams.get('pointVente');
    
  }

  ionViewDidLoad() {
    var datePipe = new DatePipe('en');
    
    if(!this.rendezvous.dateat){
      this.rendezvous.dateat = datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.rendezvous.date = datePipe.transform(new Date(), 'yyyy-MM-dd');
    }
   
   
    if(this.rendezvous.user&&this.rendezvous.user.id)
        this.rendezvous.user=this.rendezvous.user.id;    
    this.manager.get('user').then(data=>{
         this.users=data?data:[] ;
    },error=>{
    })

  }
  dismiss(data?:any){
    this.viewCtrl.dismiss(data);
  }

  onSubmit(){
    let self=this;
    this.rendezvous.change=true;
    let loader= this.notify.loading({
     content: "Enregistrement...",
  }); 
  this.rendezvous.pointVente = this.pointVente.id;
  this.manager.save('rendezvous',this.rendezvous).then((data)=>{
      loader.dismiss().then(()=>{
        if(!data.error){
          self.dismiss(data);
          return  this.notify.onSuccess({message:"Enregistrement effectué"})
        }
        this.notify.onError({message:"Une erreur s'est produite"})
       });  
   
},error=>{
  loader.dismiss()
  this.notify.onError({message:"Un probleme est survenu"})
})
  loader.present();
  }

  isInvalid(){
    return !this.rendezvous.dateat
  }
}
