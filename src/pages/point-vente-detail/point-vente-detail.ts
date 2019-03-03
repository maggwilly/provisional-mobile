import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ManagerProvider } from '../../providers/manager/manager';
import { Storage } from '@ionic/storage';
import { AppNotify } from '../../app/app-notify';

@IonicPage()
@Component({
  selector: 'page-point-vente-detail',
  templateUrl: 'point-vente-detail.html',
})
export class PointVenteDetailPage {
  commendes: any = []
  pointVente: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public manager: ManagerProvider,
    public loadingCtrl: LoadingController,
    public notify: AppNotify,
    public storage: Storage
  ) {
    this.pointVente = navParams.get('pointVente');
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
    this.storage.get(this.pointVente.id + '_commendes').then((data) => {
      this.commendes = data ? data : [];
      this.manager.show('pointvente',this.pointVente).then(data => {
        this.commendes = data ? data : []
        this.storage.set(this.pointVente.id + '_commendes', this.commendes)
      },error=>{
        this.notify.onSuccess({message:"PROBLEME ! Verifiez votre connexion internet"})
      })
    });
  }


  loadRemoteData() {
    let loader = this.loadingCtrl.create({});
      this.manager.show('pointvente',this.pointVente).then(data => {
        this.commendes = data ? data : []
        this.storage.set(this.pointVente.id + '_commendes', this.commendes)
        loader.dismiss();
      }, error => {
        this.notify.onSuccess({message:"PROBLEME ! Verifiez votre connexion internet"})
        loader.dismiss();
      });
    loader.present();
  }

  TotalQuantity(commende:any): number {
    let total = 0;
    commende.lignes.forEach(ligne => {
      total += ligne.quantite;
    });
    return total;
  }

    openCart(commende) {
      this.navCtrl.push('CommendesViewPage',{commende:commende})
    }

    getPointVente(commende: any){
      return commende.pointVenteItem?commende.pointVenteItem:commende.pointVente
    }
  add(){
    this.navCtrl.push('CommendeCreatePage',{pointVente:this.pointVente})
  }
 
}