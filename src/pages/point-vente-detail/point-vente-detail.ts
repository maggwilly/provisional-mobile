import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, Events } from 'ionic-angular';
import { ManagerProvider } from '../../providers/manager/manager';
import { Storage } from '@ionic/storage';
import { AppNotify } from '../../app/app-notify';
import { blueIcon , redIcon,greenIcon}  from  '../../app/icons-marker';
import { LocalisationProvider } from '../../providers/localisation/localisation';
import leaflet from 'leaflet';
@IonicPage()
@Component({
  selector: 'page-point-vente-detail',
  templateUrl: 'point-vente-detail.html',
})
export class PointVenteDetailPage {
  @ViewChild('mapdetail') mapElement: ElementRef;
  pointVente: any = {};
  map: any;
  queryText:string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public manager: ManagerProvider,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public localisation:LocalisationProvider,
    public events: Events,
    public notify: AppNotify,
    public storage: Storage
  ) {
    
    if(navParams.get('pointVente')){
      this.pointVente = navParams.get('pointVente');
      this.storage.set('displayed',this.pointVente)
    }else
     this.storage.get('displayed').then((displayed)=>{
      this.pointVente =displayed;
    })
  }

  ionViewDidLoad() {

    this.events.subscribe('commende.added', (data) => {
      this.pointVente.lastCommende=data;
      this.manager.storeEntityLocally('pointvente', this.pointVente)
      })
    this.loadmap();
  }

  openCart(commende) {
    this.navCtrl.push('CommendesViewPage', { commende: commende })
  }

  add() {
    let commende: any = { lignes: [], date: new Date(), pointVente:this.pointVente,total:0 };
    this.navCtrl.push('CommendesViewPage', { commende: commende })
  }

  icon(point:any){
    if(!point.rendezvous||!point.rendezvous.dateat||point.rendezvous.passdays>0)
    return blueIcon;
    if(point.rendezvous.passdays<0)
         return redIcon;
      else 
        return greenIcon;
  }

  cancelRdv() {
    let loader = this.notify.loading({
      content: "Annulation...",
    });
    this.manager.delete('rendezvous', this.pointVente.rendezvous,'delete',this.localisation.isOnline()).then((data) => {
      if (data.ok) {
        loader.dismiss().then(() => {
          this.pointVente.rendezvous = null;
          this.pointVente.change=true;
          this.manager.storeEntityLocally('pointvente',this.pointVente)
          this.notify.onSuccess({ message: "Le rendez-vous a été annulé" })
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
    this.map = leaflet.map(this.mapElement.nativeElement, {
      center: [this.pointVente.lat, this.pointVente.long],
      zoom: 13
  });
   leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      zoom: 13,
    /*  minResolution: 4891.96981025128,
      maxResolution: 39135.75848201024,*/
      doubleClickZoom: true,
      center: [this.pointVente.lat, this.pointVente.long]
    }).addTo(this.map)

      let markerGroup = leaflet.featureGroup();
      let rdv=this.pointVente.rendezvous&&this.pointVente.rendezvous.dateat?`<p>Livraison prévue le <b>${this.pointVente.rendezvous.dateat}</b></p>`:``
    let marker: any = leaflet.marker([this.pointVente.lat, this.pointVente.long], {icon: this.icon(this.pointVente)}).bindPopup(
      `<h2 style="font-weight: bold; font-size:1.9em">${this.pointVente.nom}</h2>
      <p style="color:dimgray;font-size: 1.0em">${this.pointVente.telephone}, ${this.pointVente.type},${this.pointVente.ville}, ${this.pointVente.quartier}</p>
      <p style=""> ${this.pointVente.adresse}</p>`+rdv)
      .openPopup()
      .on('click', () => {
        
      })
    markerGroup.addLayer(marker);
    this.map.addLayer(markerGroup);
  }

  search() {
    if(!this.pointVente.rendezvous||!this.pointVente.rendezvous.previsions||!this.pointVente.rendezvous.previsions.length)
       return;
    let queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
    this.pointVente.rendezvous.previsions.forEach(item => {
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

