import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { ManagerProvider } from '../../providers/manager/manager';
import { Storage } from '@ionic/storage';
import { AppNotify } from '../../app/app-notify';
import { blueIcon }  from  '../../app/icons-marker';
import leaflet from 'leaflet';
@IonicPage()
@Component({
  selector: 'page-point-vente-detail',
  templateUrl: 'point-vente-detail.html',
})
export class PointVenteDetailPage {
  pointVente: any = {};
  map: any;
 
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public manager: ManagerProvider,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public notify: AppNotify,
    public storage: Storage
  ) {
    this.pointVente = navParams.get('pointVente');
    console.log(this.pointVente );
    
  }

  ionViewDidEnter() {
    this.manager.get('commende',false, this.pointVente.id,'pointVente').then((data) => {
    //  let commendes:any[]=data;
    }, error => {
      this.notify.onError({ message: "probleme inconu" })
    })

    this.loadmap();
  }

  getLignes(commendes:any[]){
    
    let lignes:any[]=[];
    commendes.forEach(commende=>{
          console.log(commende);
    })
  return lignes;
  }

  cancelRdv() {
    let loader = this.notify.loading({
      content: "Annulation...",
    });
    this.manager.delete('rendezvous', this.pointVente.rendezvous).then((data) => {
      if (data.ok) {
        loader.dismiss().then(() => {
          this.pointVente.rendezvous = null;
          this.pointVente.change=true;
          this.manager.storeEntityLocally('pointvente',this.pointVente)
          this.notify.onSuccess({ message: "Annulé" })
        });
      }
    }, error => {
      loader.dismiss()
      this.notify.onError({ message: "Un probleme est survenu" })
    });

  }

  editRdv() {
    let modal = this.modalCtrl.create('RendezvousPage', { rendezvous: this.pointVente.rendezvous,pointVente:this.pointVente }, { cssClass: 'inset-modal' })
    modal.onDidDismiss(rdv => {
      if (!rdv)
        return
        this.pointVente.change=true;
        this.pointVente.rendezvous = rdv;
        this.manager.storeEntityLocally('pointvente',this.pointVente)
    })
    modal.present()
  }

  createRdv() {
    let modal = this.modalCtrl.create('RendezvousPage', { rendezvous: {pointVente:this.pointVente},pointVente:this.pointVente}, { cssClass: 'inset-modal' })
    modal.onDidDismiss(rdv => {
      if (!rdv)
        return
        this.pointVente.rendezvous = rdv;
        this.manager.storeEntityLocally('pointvente',this.pointVente)
    })
    modal.present()
  }

  edit() {
    let modal = this.modalCtrl.create('PointVentePage', { pointVente: this.pointVente })
    modal.onDidDismiss(data => {
      if (!data)
        return     
    })
    modal.present()
  }

  loadmap() {
    this.map=null;
    if(!this.pointVente.lat||!this.pointVente.long)
      return
    this.map = leaflet.map('map', {
      center: [this.pointVente.lat, this.pointVente.long],
      zoom: 45
  });
   leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      zoom: 45,
      minResolution: 4891.96981025128,
      maxResolution: 39135.75848201024,
      doubleClickZoom: true,
      center: [this.pointVente.lat, this.pointVente.long]
    }).addTo(this.map)

      let markerGroup = leaflet.featureGroup();
    let marker: any = leaflet.marker([this.pointVente.lat, this.pointVente.long], {icon: blueIcon}).on('click', () => {
      alert('Marker clicked');
    })
    markerGroup.addLayer(marker);
    this.map.addLayer(markerGroup);




  }

}

