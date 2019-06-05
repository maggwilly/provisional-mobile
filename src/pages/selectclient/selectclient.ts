import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams,ModalController, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ManagerProvider } from '../../providers/manager/manager';
import { AppNotify } from '../../app/app-notify';
/**
 * Generated class for the PointventesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-selectclient',
  templateUrl: 'selectclient.html',
})
export class SelectclientPage {
  pointventes: any[] = []
  queryText = '';
  constructor(
    public navCtrl: NavController,
    public manager: ManagerProvider,
    public viewCtrl: ViewController,
    public events:Events,
     public modalCtrl: ModalController,
    public notify: AppNotify,
    public storage: Storage,    
    public navParams: NavParams) {
      this.events.subscribe('loaded:pointvente:new',()=>{
        this.loadData();
       })
  }

  ionViewDidLoad() {
    this.loadData()
  }

  dismiss(data?:any) {
    this.viewCtrl.dismiss(data);
}
  loadData(onlineIfEmpty?:boolean){    

    this.manager.get('pointvente').then(data=>{
      this.pointventes=data?data:[]   
    },error=>{
      this.notify.onError({message:"Verifiez votre connexion internet"})
  });
  }

  add(pointVente={}){
    let self=this;
    let modal=  this.modalCtrl.create('PointVentePage',{pointVente:pointVente,inset:true}, { cssClass: 'inset-modal' })
    modal.onDidDismiss(data=>{
      let index=-1;
      if(!data)
      return
      if(data&&data.deletedId||data.id){
        index= this.pointventes.findIndex(item=>item.id==data.deletedId||item.id==data.id);
         if(index>-1)
        this.pointventes.splice(index,1);
        this.pointventes.splice(0,0,data); 
        self.dismiss(data);
      } 
    }) 
    modal.present()
  //  this.navCtrl.push('PointVentePage',{pointVente:pointVente})
  }

  findRemove(data:any){
       let   index= this.pointventes.findIndex(item=>item.id==data.deletedId);
        if(index>-1)
       this.pointventes.splice(index,1);
  }
 
  search() {
    let queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
    this.pointventes.forEach(item => {
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
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }
    item.hide = !(matchesQueryText);
  }
}
