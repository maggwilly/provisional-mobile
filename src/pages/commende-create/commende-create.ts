import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ManagerProvider } from '../../providers/manager/manager';
import { AppNotify } from '../../app/app-notify';
import { DatePipe} from "@angular/common";

@IonicPage()
@Component({
  selector: 'page-commende-create',
  templateUrl: 'commende-create.html',
})
export class CommendeCreatePage {
  produits: any[] = []
  commende: any = { lignes: [] }
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
    this.manager.post('commende',this.commende).then(()=>{
        this.notify .onSuccess({message:"enregistrement effectué"})
      },error=>{
        this.notify.onError({message:"PROBLEME ! Verifiez votre connexion internet"})
   })
   }

  getPointVente(commende: any){
    return commende.pointVenteItem?commende.pointVenteItem:commende.pointVente
  }

  openCart() {
    this.navCtrl.push('CommendesViewPage',{commende:this.commende})
  }

  addInCart(produit: any) {
    let confirm = this.alertCtrl.create({
      title: 'Ajouter à la facture',
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
              if (this.isInCart(produit))
                return
              this.commende.lignes.push({ produit: produit.id, quantite: data.quantite, produitItem: produit })
            }
          }
        }
      ]
    });
    confirm.present();
  }
  TotalQuantity(commende:any): number {
    let total = 0;
    commende.lignes.forEach(ligne => {
      total += ligne.quantite;
    });
    return total;
  }


  isInCart(produit: any): boolean {
    if (!this.commende.lignes.length)
      return
    return this.commende.lignes.find((item) => { return (item.produit == produit.id); })
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
