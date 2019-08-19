import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';

/**
 * Generated class for the CreatelignePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-createligne',
  templateUrl: 'createligne.html',
})
export class CreatelignePage {
  ligne:any={quantite:1,stock:0,acn:true};
  produit:any;
  constructor(public navCtrl: NavController,
      public viewCtrl: ViewController,
      public navParams: NavParams) {
       this.produit=this.navParams.get('produit');
      this.ligne.produit=this.produit;
      this.ligne.nom=this.produit.nom;
      this.ligne.pu=this.produit.cout;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatelignePage');
  }
  dismiss(data?:any){
    this.viewCtrl.dismiss(data);
  }

  total():number{
    this.ligne.total=this.ligne.quantite*this.ligne.pu;
    return this.ligne.total;
  }

  isInvalid(){
  return !this.ligne.quantite;
  }

  onSubmit(){
   this.dismiss(this.ligne)
  }
}
