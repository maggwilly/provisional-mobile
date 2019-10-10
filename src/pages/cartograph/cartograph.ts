import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, ModalController } from 'ionic-angular';
import { LocalisationProvider } from '../../providers/localisation/localisation';
import { greenIcon, blueIcon, orangeIcon, redIcon } from '../../app/icons-marker';
import leaflet from 'leaflet';
import 'leaflet-routing-machine'
import { AppNotify } from '../../app/app-notify';
import { ManagerProvider } from '../../providers/manager/manager';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-cartograph',
  templateUrl: 'cartograph.html',
})
export class CartographPage {
  @ViewChild('mapview') mapview: ElementRef;
  map: any;
  points: any[] = [];
  filtre: any
  markerGroup: any;
  isOnline: boolean;
  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public manager: ManagerProvider,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public localisation: LocalisationProvider,
    public notify: AppNotify,
    public connectivityService: LocalisationProvider,
    public navParams: NavParams) {
    this.isOnline = this.connectivityService.isOnline();
    this.filtre = this.navParams.get('filtre');
  }

  ionViewDidLoad() {
    this.refresh();
  }

  initMap() {
    this.connectivityService.getCurrentPosition().then((position) => {
      if (!position.coords.latitude || !position.coords.longitude)
        return this.notify.onError({ message: "Problème de centralisation de la carte. Verifiez votre connexion internet" });
      this.loadmap(position.coords);
    }, error => {
      this.notify.onError({ message: error.message })
      console.log(error);
    })
  }


  loadmap(coords?: any) {
    if (this.map)
      return this.addLayers(this.map);
    this.map = leaflet.map(this.mapview.nativeElement, {
      center: [coords.latitude, coords.longitude],
      zoom: 13
    });
    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      zoom: 13,
      doubleClickZoom: true,
      center: [coords.latitude, coords.longitude]
    }).addTo(this.map)

    this.addLayers(this.map)
  }


  addLayers(map: any) {
    this.markerGroup = leaflet.featureGroup();
    this.markerGroup.clearLayers();
    this.points.forEach(point => {
      if (!point.lat || !point.long)
        return
      
      let marker: any = leaflet.marker([point.lat, point.long], { icon: this.icon(point) })
        .bindPopup(
          `<h2 style="font-weight: bold; font-size:1.9em">${point.nom}</h2>
   <p style="color:dimgray;font-size: 1.0em">${point.telephone}, ${point.type},${point.ville}, ${point.quartier}</p>
   <p style=""> ${point.adresse}</p>`)
        .openPopup()
        .on('click', () => {

        })
      this.markerGroup.addLayer(marker);
      map.addLayer(this.markerGroup);
    });
  }


  icon(point: any) {
    switch (point.visited) {
      case 0:
        return redIcon;
      case 1:
        return orangeIcon;
      case 2:
        return greenIcon;
      default:
        return blueIcon;
    }
  }

  refresh(loading=false) {
    if (this.markerGroup)
      this.markerGroup.clearLayers();
    if (!this.filtre)
      this.filtre = {
        type: ''
        , user: '', secteur: '',
        ville: '',
        afterdate: moment().startOf('month').format("YYYY-MM-DD"),
        beforedate: moment().endOf('month').format("YYYY-MM-DD")
      };
    if (this.connectivityService.isOnline())
      return this.loadRemoteData(loading);
    return this.loadData()
  }


  loadData() {
    this.manager.get('map', this.localisation.isOnline()).then(data => {
      this.points = data
      this.initMap()
      this.localisation.onConnect(this.localisation.isOnline());
    }, error => {
      this.localisation.onConnect(false);
      this.notify.onSuccess({ message: "PROBLEME ! Verifiez votre connexion internet" })
    })
  };

  loadRemoteData(loading=false) {
    let loader = this.loadingCtrl.create({
      content: "chargement...",
    });
    this.manager.get('map', true, null, null, this.filtre, 1).then(data => {
      this.points = data
      this.initMap()
      loader.dismiss();
      this.localisation.onConnect(this.localisation.isOnline());
    }, error => {
      this.localisation.onConnect(false);
      loader.dismiss();
      console.log(error);
      this.notify.onSuccess({ message: "PROBLEME ! Verifiez votre connexion internet" })
    });
    if (loading) {
      loader.present();
    }
   
  }

  openFilter() {
    let modal = this.modalCtrl.create('FiltreStatsPage', { filtre: this.filtre })
    modal.onDidDismiss(data => {
      if (!data)
        return;
      return this.loadRemoteData();
    });
    modal.present()
  }
}
