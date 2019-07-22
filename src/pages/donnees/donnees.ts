import { Component } from '@angular/core';
import {PopoverController, IonicPage, NavController, NavParams , App } from 'ionic-angular';

/**
 * Generated class for the DonneesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-donnees',
  templateUrl: 'donnees.html',
})
export class DonneesPage {


  pages:any[]=[
    {name:'Mes Clients', component:'PointventesPage', icon:'contacts'},
    {name:'Mes Produits', component:'ProduitsPage', icon:'md-bookmarks'},
    {name:'Mes Secteurs', component:'SecteursPage', icon:'md-map'}
  ]

   suppages:any[]=[
    {name:'Mon equipe de vente', component:'VendeursPage', icon:'ios-people'},
    {name:'Statistiques du mois', component:'StatsPage', icon:'md-analytics'},
    {name:'Rapports memsuels', component:'RapportsPage', icon:'ios-paper'},    
  ] 


  constructor(
    public navCtrl: NavController,
    private popoverCtrl: PopoverController,
     public app: App,
     public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DonneesPage');
  }
  presentPopover(ev?:any) {

    let popover = this.popoverCtrl.create('PopOverMenuPage',{navCtrl:this.navCtrl});
    popover.present({
      ev: ev
    });
  }
  openPage(p:any){
    this.app.getRootNav().push(p.component)
  } 
}
