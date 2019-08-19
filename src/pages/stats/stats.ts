import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { ManagerProvider } from '../../providers/manager/manager';
import { AppNotify } from '../../app/app-notify';

import * as moment from 'moment';
import { LocalisationProvider } from '../../providers/localisation/localisation';
/**
 * Generated class for the StatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
})
export class StatsPage {
  pieChartData;
  stats:any
  datatable:any[][];
  filtre:any
  isOnline:boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public localisation:LocalisationProvider,
    public manager: ManagerProvider,
    public loadingCtrl: LoadingController,
    public notify: AppNotify,
  ) {
    this.isOnline=this.localisation.isOnline();
  }

  ionViewDidLoad() {
    this.refresh();
   
  }

  loadData() {
      this.manager.show('stat','sale-satat',this.localisation.isOnline()).then(data => {
        this.stats = data
         this.makeUpData().then((datatable:any[][])=>{
          this.useAngularLibrary(datatable);
         },err=>{})
         this.localisation.onConnect(this.localisation.isOnline());
        },error=>{
          this.localisation.onConnect(false);
        this.notify.onSuccess({message:"PROBLEME ! Verifiez votre connexion internet"})
      })
    };

  refresh(){
      this.filtre={type:''
      ,user:'',secteur:'',
      ville:'',
      afterdate:moment().startOf('month').format("YYYY-MM-DD"),
      beforedate:moment().endOf('month').format("YYYY-MM-DD")};
        if(this.localisation.isOnline())
          return this.loadRemoteData();
      return this.loadData()
    }

    openMap(){
      this.navCtrl.push('CartographPage',{filtre:this.filtre})
    }
    
makeUpData(){
 return new Promise((resolve,reject)=>{
    this.datatable=[['Semaine','Prospectés','Engagés','Rendez-vous programmés','Livraisons ou visites']];
    Object.keys(this.stats.weeks).forEach(key => {
      let entry:any=this.stats.weeks[key];
      let week:any[]=[];
      week.push(key);
      week.push(Number(entry.created));
      week.push(Number(entry.engaged));
      week.push(Number(entry.visitedtarget))
      week.push(Number(entry.visited));
      this.datatable.push(week);
    })
    resolve(this.datatable)
  })
 

}


  loadRemoteData() {
    let loader = this.loadingCtrl.create({
      content: "chargement...",
    });
    this.manager.show('stat',0,true,this.filtre).then(data => {
      this.stats = data
      this.makeUpData().then((datatable:any[][])=>{
        this.useAngularLibrary(datatable);
       },err=>{})
      loader.dismiss(); 
      this.localisation.onConnect(this.localisation.isOnline());
    },error=>{
      this.localisation.onConnect(false);
      loader.dismiss();
      console.log(error);
      this.notify.onSuccess({message:"PROBLEME ! Verifiez votre connexion internet"})
    });
    loader.present();
  }

  useAngularLibrary(datatable:any[][]) {
    this.pieChartData = {
      chartType: 'ColumnChart',
       dataTable: datatable,
      options: {
        height: 400,
      legend: { position: 'top', maxLines: 1 },
      hAxis: {
         viewWindow: {
          min: [7, 30, 0],
          max: [17, 30, 0]
        }
      } 
    }
    }

  //  let ccComponent = this.pieChartData.component
    //ccComponent.draw();
    //console.log(this.pieChartData);
}
openFilter() {
  let modal = this.modalCtrl.create('FiltreStatsPage', { filtre: this.filtre })
  modal.onDidDismiss(data => {
    if(!data)
    return;
  return this.loadRemoteData();
  });
  modal.present()
}
}