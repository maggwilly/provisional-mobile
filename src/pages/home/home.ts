
import { Component } from '@angular/core';
import {PopoverController,IonicPage, Events, NavController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ManagerProvider } from '../../providers/manager/manager';
import { AppNotify } from '../../app/app-notify';
import { UserProvider } from '../../providers/user/user';
import { LocalisationProvider } from '../../providers/localisation/localisation';
import * as moment from 'moment';
import *  as groupby from 'group-array';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  rendezvous: any = [];
  queryText = '';
  filtre:any
  nbrecriteres:number;
  loading:boolean;
  isOnline:boolean;
  groups:any[]=[]
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public events: Events,
    public manager: ManagerProvider,
    public localisation:LocalisationProvider,
    public userService:UserProvider,
    private popoverCtrl: PopoverController,
    public notify: AppNotify,
    public loadingCtrl: LoadingController,
    public storage: Storage) { 
      this.isOnline=this.localisation.isOnline();
      this.events.subscribe('loaded:pointvente:new',()=>{
        /*if(!this.nbrecriteres)
           this.loadData();*/
       })
    }

  ionViewDidLoad() {
  this.userService.getAuthenticatedUser().subscribe(user=>{
    if(user)
    this.refresh();
     
  })
  }

  loadData(){
    this.loading=true;
      this.manager.get('pointvente',this.localisation.isOnline()).then(data=>{
        this.rendezvous=data?data:[];
        let groups= groupby(data?data:[],'secteur.nom');
        this.groups= Object.keys(groups).map(key => ({secteur: key, poinventes: groups[key]}));
        this.search()
        this.loading=false;
        this.localisation.onConnect(this.localisation.isOnline());
      },error=>{
        this.localisation.onConnect(false);
        this.notify.onSuccess({message:"Probleme de connexion"})
      })
   
  }

  
  loadRemoteData(){
    this.countCricteres(this.filtre);
    this.loading=true;
    let loader = this.loadingCtrl.create({ content: "chargement..."});    
    this.manager.get('pointvente',true,null,null,this.filtre,this.nbrecriteres).then(data=>{
      this.rendezvous=data?data:[];
      let groups= groupby(data?data:[],'secteur.nom');
      this.groups= Object.keys(groups).map(key => ({secteur: key, poinventes: groups[key]}));
      this.search()
      this.loading=false;
      loader.dismiss();    
      this.localisation.onConnect(this.localisation.isOnline());
    },error=>{
      this.localisation.onConnect(false);
       loader.dismiss(); 
      this.notify.onSuccess({message:"Probleme de connexion"})
    })
    loader.present();
  }

  sort(arr:any[]){
    if(arr.length<=1)
    return arr;
    this.rendezvous.sort((a:any,b:any)=>{
      if((!a.rendezvous||!a.rendezvous)||(a.rendezvous&&!a.rendezvous.dateat||a.rendezvous&&!a.rendezvous.dateat))
         return -1;
       return -1;
    })
  }
  refresh(){
    if(!this.filtre)
    this.filtre={type:'',user:'',
    secteur:'',ville:'',
    afterdate:moment().startOf('year').format("YYYY-MM-DD"),
    //aftervisitedate:moment().startOf('month').format("YYYY-MM-DD"),
    afterrendevousdate:moment().startOf('year').format("YYYY-MM-DD"),

    beforedate:moment().format("YYYY-MM-DD"),
    beforevisitedate:moment().endOf('week').format("YYYY-MM-DD"),
    beforrendezvousdate:moment().endOf('month').format("YYYY-MM-DD")
  
  };
    this.nbrecriteres=0;
    this.queryText='';
    if(this.localisation.isOnline())
       return this.loadRemoteData();
    this.loadData();
  }

  openFilter() {
    let modal = this.modalCtrl.create('FiltrePointventePage', { filtre: this.filtre })
    modal.onDidDismiss(data => {
    if(!data)
      return;
      this.countCricteres(this.filtre);
    return this.loadRemoteData();
    });
    modal.present()
  }

  doScroll(env){

  }
  countCricteres(data:any){
    let nbrecriteres=0;
    Object.keys(data).forEach(key => {
      if(data[key])
        nbrecriteres++;
    });
    this.nbrecriteres=nbrecriteres;
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
    this.navCtrl.push('MapPage',{target: 'rendezvous',points: this.rendezvous,title:`Aperçu des réalités`,filtre: this.filtre});
  }
}
