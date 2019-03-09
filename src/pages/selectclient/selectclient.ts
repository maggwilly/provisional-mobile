import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ModalController } from 'ionic-angular';
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
    public loadingCtrl: LoadingController,
     public modalCtrl: ModalController,
    public notify: AppNotify,
    public storage: Storage,    
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.loadData()
  }

  loadData(){    
    this.storage.get('_pointventes').then((data) => {
      this.pointventes = data?data:[];
    this.manager.get('pointvente').then(data=>{
      this.pointventes=data?data:[]
      this.storage.set('_pointventes',this.pointventes)    
    },error=>{
      this.notify.onError({message:"Verifiez votre connexion internet"})
    })
  });
  }




  add(pointVente={}){
    let modal=  this.modalCtrl.create('PointVentePage',{pointVente:pointVente})
    modal.onDidDismiss(data=>{
      let index=-1;
     if (data&&data.id) {
        index= this.pointventes.findIndex(item=>item.id==data.id);
        if(index>-1)
           this.pointventes.splice(index,1);
         this.pointventes.push(data);
         this.storage.set('_pointventes',this.pointventes) 
     }else if(data&&data.deletedId){
       return this.findRemove(data);
     }
    }) 
    modal.present()
  //  this.navCtrl.push('PointVentePage',{pointVente:pointVente})
  }

  findRemove(data:any){
       let   index= this.pointventes.findIndex(item=>item.id==data.deletedId);
        if(index>-1)
       this.pointventes.splice(index,1);
       this.storage.set('_pointventes',this.pointventes) 
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
