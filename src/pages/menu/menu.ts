import { Component, ViewChild } from '@angular/core';
import {PopoverController,Nav, IonicPage, NavController, NavParams, ModalController ,MenuController } from 'ionic-angular';
import {UserProvider } from '../../providers/user/user';
import { Config } from "../../app/config";
@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  @ViewChild(Nav) nav: Nav;
  rootPage:any= Config.HomePage;
 
  pages:any[]=[
    {name:'Prévisions', component: Config.HomePage, icon:'home'},
    {name:'Liste des clients', component:'PointventesPage',addPage:'PointVentePage', icon:'contacts'},
    {name:'Liste des produits', component:'ProduitsPage',addPage:'ProduitPage', icon:'md-bookmarks'},
    {name:'Zones de vente', component:'SecteursPage', addPage:'SecteurPage',icon:'md-map'},
    {name:'Historique des ventes', component:'CommendesPage',addPage:'SelectclientPage', icon:'ios-stats-outline'}
  ]

   suppages:any[]=[
    {name:'Tableau de bord', component:'StatsPage', icon:'md-analytics'},
    {name:'Cartographie', component:'CartographPage', icon:'ios-map-outline'},
    {name:'Mon equipe', component:'VendeursPage', icon:'ios-people'},
   // {name:'Prévisions', component:'PrevisionsPage', icon:'md-pulse'}
  ] 


  constructor(
    public navCtrl: NavController,
    private popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public userService:UserProvider,
    public menu: MenuController,
    public navParams: NavParams) {
      let skippecheck=this.navParams.get('skippecheck')
      userService.resetObserver();
      userService.complete.then(user => {
    if (!user||!user.id||!user.parent) 
            return userService.go(user);  
      else if(user.receiveRequests&&user.receiveRequests.length&&!skippecheck)  
            return  userService.request(user.receiveRequests);
      else if(
           (userService.amIMyParent()&&(!user.entreprise||!user.ville||!user.pays)&&!skippecheck)
           ||
           (!userService.amIMyParent()&&(!user.nom)&&!skippecheck)
             )
             return this.nav.setRoot('ProfilePage',{user:user});//userService.profile(user);
      /* else if( (!user.parent.abonnement||user.parent.abonnement.expired)&&!skippecheck)
             return userService.shoulpay(user.parent.abonnement);*/
    }, (ERROR) => {
          console.log(ERROR);
          return  userService.unavailable();   			
    })     
  }



  presentPopover(ev?:any) {
    let popover = this.popoverCtrl.create('PopOverMenuPage',{navCtrl:this.nav,menu:this.menu});
    popover.present({
      ev: ev
    });
  }
  
  openPage(p:any,openAddPage?:boolean){
    this.menu.close()
    this.nav.push(p.component,{openAddPage:openAddPage})
  } 
}