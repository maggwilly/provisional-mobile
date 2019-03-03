import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ManagerProvider } from '../../providers/manager/manager';
import { AppNotify } from '../../app/app-notify';
@IonicPage()
@Component({
  selector: 'page-commendes-view',
  templateUrl: 'commendes-view.html',
})
export class CommendesViewPage {
  commende: any
  constructor(
    public navCtrl: NavController,
    public manager: ManagerProvider,
    public notify: AppNotify,
    public navParams: NavParams
  ) {
    this.commende = this.navParams.get('commende');
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad');
  }


  save(){
   this.manager.post('commende',this.commende).then(()=>{
       this.notify .onSuccess({message:"enregistrement effectué"})
     },error=>{
      this.notify.onError({message:"PROBLEME ! Verifiez votre connexion internet"})
  })
  }

  removeFromCart(ligne: any) {
    if(!ligne.produitItem)
    return;
    let index = this.commende.lignes.findIndex(item => { return (item.produit == ligne.produit) });
    if (index > -1)
      this.commende.lignes.splice(index);
  }


  nuberOfLines(): number {
    return this.commende.lignes.length;
  }


  getProduit(ligne: any){
    return ligne.produitItem?ligne.produitItem:ligne.produit
  }

  getPointVente(commende: any){
    return commende.pointVenteItem?commende.pointVenteItem:commende.pointVente
  }

  TotalQuantity(): number {
    let total = 0;
    this.commende.lignes.forEach(ligne => {
      total += ligne.quantite;
    });
    return total;
  }

  TotalCash(): number {
    let total = 0;
    this.commende.lignes.forEach(ligne => {
      total += this.getProduit(ligne).prix* ligne.quantite;
    });
    return total;
  }
}
