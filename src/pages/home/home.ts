import { Component } from '@angular/core';
import {PopoverController,IonicPage, Events, NavController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ManagerProvider } from '../../providers/manager/manager';
import { AppNotify } from '../../app/app-notify';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  rendezvous: any = [];
  queryText = '';
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public events: Events,
    public manager: ManagerProvider,
    public userService:UserProvider,
    private popoverCtrl: PopoverController,
    public notify: AppNotify,
    public loadingCtrl: LoadingController,
    public storage: Storage) { 
      this.events.subscribe('loaded:rendezvous:new',()=>{
        this.loadData();
       })
    }

  ionViewDidLoad() {
  this.userService.getAuthenticatedUser().subscribe(user=>{
    if(user)
      this.loadData(true);
  })

  }

  loadData(onlineIfEmpty?:boolean){
      this.manager.get('rendezvous').then(data=>{
        this.rendezvous=data?data:[]
        if(onlineIfEmpty&&(!data||data.length))
        return this.loadRemoteData();
      },error=>{
        console.log(error);
        
        this.notify.onSuccess({message:"Probleme de connexion"})
      })
   
  }



  loadRemoteData(){
    let loader = this.loadingCtrl.create({
      content: "chargement...",
    });    
    this.manager.get('rendezvous',true).then(data=>{
      this.rendezvous=data?data:[]
      loader.dismiss();      
    },error=>{
      console.log(error);
      loader.dismiss(); 
      this.notify.onSuccess({message:"Probleme de connexion"})
    })
    loader.present();
  }


  show(rendezvous:any){
   this.navCtrl.push('PointVenteDetailPage',{rendezvous:rendezvous})
  }

  
  search() {
      let queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
      this.rendezvous.forEach(item => {
        item.hide = true;
        this.filter(item, queryWords);
      });
    
  }

  filter(item, queryWords) {
    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach(queryWord => {
        if (item.nom.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      matchesQueryText = true;
    }
    item.hide = !(matchesQueryText);
  }

    presentPopover(ev?:any) {

    let popover = this.popoverCtrl.create('PopOverMenuPage');
    popover.present({
      ev: ev
    });
  }
}
