import { Component } from '@angular/core';
import {PopoverController,IonicPage, Events, NavController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ManagerProvider } from '../../providers/manager/manager';
import { AppNotify } from '../../app/app-notify';
import { UserProvider } from '../../providers/user/user';
import * as moment from 'moment';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  rendezvous: any = [];
  queryText = '';
  filtre:any={type:'',user:'',secteur:'',ville:'',beforedate:moment().format("YYYY-MM-DD"),beforelastvisitedate:moment().format("YYYY-MM-DD")}
  nbrecriteres:number;
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
      this.events.subscribe('loaded:pointvente:new',()=>{
        if(!this.nbrecriteres)
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
      this.manager.get('pointvente').then(data=>{
        this.rendezvous=data?data:[]
        if(onlineIfEmpty&&(!data||data.length))
        return this.loadRemoteData();
      },error=>{
        this.notify.onSuccess({message:"Probleme de connexion"})
      })
   
  }

  refresh(){
    this.filtre={type:'',user:'',secteur:'',ville:'',beforedate:moment().format("YYYY-MM-DD"),beforelastvisitedate:moment().format("YYYY-MM-DD")};
    this.nbrecriteres=0;
    this.queryText='';
    return this.loadRemoteData();
  }

  openFilter() {
    let modal = this.modalCtrl.create('FiltrePointventePage', { filtre: this.filtre })
    modal.onDidDismiss(data => {
    console.log(data);
    if(!data)
      return;
      let nbrecriteres=0;
    Object.keys(data).forEach(key => {
      if(data[key])
        nbrecriteres++;
    });
    this.nbrecriteres=nbrecriteres;
    return this.loadRemoteData();
    });
    modal.present()
  }

  doScroll(env){

  }

  loadRemoteData(){
    let loader = this.loadingCtrl.create({
      content: "chargement...",
    });    
    this.manager.get('pointvente',true,null,null,this.filtre,this.nbrecriteres).then(data=>{
      this.rendezvous=data?data:[]
      loader.dismiss();      
    },error=>{
      console.log(error);
      loader.dismiss(); 
      this.notify.onSuccess({message:"Probleme de connexion"})
    })
    loader.present();
  }


  show(pointVente:any){
   this.navCtrl.push('PointVenteDetailPage',{pointVente: pointVente})
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

    let popover = this.popoverCtrl.create('PopOverMenuPage',{navCtrl:this.navCtrl});
    popover.present({
      ev: ev
    });
  }

  openMap(){
    let points:any[]=[];
    this.rendezvous.forEach(point => {
      if (point.lat&&point.long) {
        points.push({pos:{lat:point.lat,long:point.long},
                      title:point.nom,
                      address:point.adresse,
                      type:point.type,
                      quartier:point.quartier,
                      visited:point.lastCommende,
                     })
      }
    });
    this.navCtrl.push('MapPage',{points: points,title:`Aperçu des réalités`});
  }
}
