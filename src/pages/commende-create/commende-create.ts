import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ManagerProvider } from '../../providers/manager/manager';
import { AppNotify } from '../../app/app-notify';
import { DatePipe} from "@angular/common";
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-commende-create',
  templateUrl: 'commende-create.html',
})
export class CommendeCreatePage {
  produits: any[] = []
  commende: any = { lignes: [], typeInsident:'Rien à signaler' }
  pointVente:any={};
  queryText = '';
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public manager: ManagerProvider,
    public loadingCtrl: LoadingController,
    public notify: AppNotify,
    public storage: Storage) {
      this.pointVente=navParams.get('pointVente');
      this.commende.pointVenteItem=this.pointVente;
      this.commende.pointVente=this.pointVente.id;
      let datePipe = new DatePipe('en');
      this.commende.date = datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ionViewDidLoad() {
    this.loadData()
  }

  loadData(){    
    this.storage.get('_produits').then((data) => {
      this.produits = data;
    this.manager.get('produit').then(data=>{
      this.produits=data?data:[]
      this.storage.set('_produits',this.produits)    
    },error=>{
      this.notify.onError({message:"PROBLEME ! Verifiez votre connexion internet"})
    })
  });
  }

  save(){
    let loader = this.loadingCtrl.create({});
    this.manager.post('commende',this.commende).then(()=>{
        this.notify .onSuccess({message:"enregistrement effectué"})
        this.navCtrl.setRoot(HomePage, {}, {animate: true, direction: 'forward'});
        loader.dismiss();
      },error=>{
        console.log(error);
        loader.dismiss();
        this.notify.onError({message:"PROBLEME ! Verifiez votre connexion internet"})
   })
   loader.present();
   }

  getPointVente(commende: any){
    return commende.pointVenteItem?commende.pointVenteItem:commende.pointVente
  }

  openCart() {
    this.navCtrl.push('CommendesViewPage',{commende:this.commende})
  }

  addInCart(produit: any) {
    let confirm = this.alertCtrl.create({
      title: 'AJOUTER UN PRODUIT',
      inputs: [
        {
          name: 'quantite',
          type: 'number',
          label: 'Quantité',
          placeholder: 'quantité',
          value: '1'

        }
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Ajouter',
          handler: (data) => {
            if (data.quantite) {
              this.removeFromCart({produit:produit.id})
              this.commende.lignes.push({ produit: produit.id, quantite: data.quantite, produitItem: produit })
            }
          }
        }
      ]
    });
    confirm.present();
  }
  TotalQuantity(commende:any): number {
    let total:number= 0;
    commende.lignes.forEach(ligne => {
      total += Number(ligne.quantite) ;
    });
    return total;
  }


  removeFromCart(ligne: any) {
    let index = this.commende.lignes.findIndex(item => { return (item.produit == ligne.produit) });
    if (index > -1)
      this.commende.lignes.splice(index,1);
  }

  search() {
    let queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
    this.produits.forEach(item => {
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
