import { Component, ViewChild } from '@angular/core';
import {PopoverController,Nav, IonicPage, NavController, NavParams, ModalController ,MenuController } from 'ionic-angular';
import {UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  @ViewChild(Nav) nav: Nav;
  rootPage:any='HomePage';
 
  pages:any[]=[
    {name:'Accueil', component:'HomePage', icon:'home'},
    {name:'Mes Clients', component:'PointventesPage',addPage:'PointVentePage', icon:'contacts'},
    {name:'Mes Produits', component:'ProduitsPage',addPage:'ProduitPage', icon:'md-bookmarks'},
    {name:'Zones de vente', component:'SecteursPage', addPage:'SecteurPage',icon:'md-map'},
    {name:'Mes Ventes', component:'CommendesPage',addPage:'SelectclientPage', icon:'ios-stats-outline'}
  ]

   suppages:any[]=[
    {name:'Mon equipe de vente', component:'VendeursPage', icon:'ios-people'},
    {name:'Statistiques du mois', component:'StatsPage', icon:'md-analytics'},
    {name:'Rapports memsuels', component:'RapportsPage', icon:'ios-paper'},    
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
            return userService.go();  
      else if(user.receiveRequests&&user.receiveRequests.length&&!skippecheck)  
            return  userService.request(user.receiveRequests);
      else if(
           (userService.amIMyParent()&&(!user.entreprise||!user.ville||!user.pays)&&!skippecheck)
           ||
           (!userService.amIMyParent()&&(!user.nom)&&!skippecheck)
             )
             return this.nav.setRoot('ProfilePage',{user:user});//userService.profile(user);
       else if( (!user.parent.abonnement||user.parent.abonnement.expired)&&!skippecheck)
             return userService.shoulpay(user.parent.abonnement);
    }, (ERROR) => {
          console.log(ERROR);
          return  userService.unavailable();   			
    })     
  }



  presentPopover(ev?:any) {
    let popover = this.popoverCtrl.create('PopOverMenuPage',{navCtrl:this.nav});
    popover.present({
      ev: ev
    });
  }
  
  openPage(p:any,openAddPage?:boolean){
    this.menu.close()
    this.nav.setRoot(p.component,{openAddPage:openAddPage})
  } 
}