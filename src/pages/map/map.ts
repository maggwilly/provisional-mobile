import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LocalisationProvider } from '../../providers/localisation/localisation';
import { blueIcon,greenIcon,redIcon }  from  '../../app/icons-marker';
import leaflet from 'leaflet';
import 'leaflet-routing-machine'
import { AppNotify } from '../../app/app-notify';
import moment from "moment"

/**
 * Generated class for the MapPage page.
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
 // map: GoogleMap;
  map: any;
  mapInitialised: boolean = false;
  allpoint:boolean;
  filtre:any
  points:any[]=[];
  waypoints:any[]=[]
  title:string;
  target:string;
  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public notify: AppNotify,
    public connectivityService: LocalisationProvider,
    public navParams: NavParams) {
    this.title=this.navParams.get('title');
    this.points=this.navParams.get('points');
    this.filtre = this.navParams.get('filtre');
    this.target = this.navParams.get('target');
  }

  ionViewDidEnter() {
      this.connectivityService.getCurrentPosition().then((position) => {
        console.log(position);
        if(!position.coords.latitude||!position.coords.longitude)
        return  this.notify.onError({ message: "Problème de centralisation de la carte. Verifiez votre connexion internet"});
         this.loadmap(position.coords);
      },error=>{
        this.notify.onError({ message: error.message})
      console.log(error); 
      })
     
    
   }

   loadmap(coords?:any) {
    this.map = leaflet.map(this.mapElement.nativeElement, {
      center: [coords.latitude, coords.longitude],
      zoom: 13
  });
   leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      zoom: 13,
      /*minResolution: 4891.96981025128,
      maxResolution: 39135.75848201024,*/
      doubleClickZoom: true,
      center: [coords.latitude, coords.longitude]
    }).addTo(this.map)
    switch (this.target) {
      case 'pointvente':
        this.addMarkerPointventes();
        break;
        case 'rendezvous':
          this.addMarkerRendezvous();
          break;    
      default:
          this.addMarkerCommendes();
        break;
    }

  }
 

addMarkerPointventes(){
  this.points.forEach(point => {
    let markerGroup = leaflet.featureGroup();
    if(!point.lat||!point.long)
        return;
      
  let marker: any = leaflet.marker([point.lat, point.long], {icon: blueIcon}).bindPopup(
    `<h2 style="font-weight: bold; font-size:1.9em">${point.nom}</h2>
    <p style="color:dimgray;font-size: 1.0em">${point.telephone}, ${point.type},${point.ville}, ${point.quartier}</p>
    <p style=""> ${point.adresse}</p>`)
    .openPopup()
    .on('click', () => {
      
    })
  markerGroup.addLayer(marker);
  this.map.addLayer(markerGroup);
});
}

addMarkerRendezvous(){
  this.points.forEach(point => {
    let markerGroup = leaflet.featureGroup();
    if(!point.lat||!point.long)
        return;
  let marker: any = leaflet.marker([point.lat, point.long], {icon: this.icon(point)}).bindPopup(
    `<h2 style="font-weight: bold; font-size:1.9em">${point.nom}</h2>
    <p style="color:dimgray;font-size: 1.0em">${point.telephone}, ${point.type},${point.ville}, ${point.quartier}</p>
    <p style=""> ${point.adresse}</p>
    <p>Livraison prévue le <b>${point.rendezvous.dateat}</b></p>`)
    .openPopup()
    .on('click', () => {
      
    })
  markerGroup.addLayer(marker);
  this.map.addLayer(markerGroup);
});
}

icon(point:any){
  if(!point.rendezvous||!point.rendezvous.dateat||point.rendezvous.passdays>0)
  return blueIcon;
  if(point.rendezvous.passdays<0)
       return redIcon;
    else 
      return greenIcon;
}
addMarkerCommendes(){
  this.points.forEach(commende => {
    let markerGroup = leaflet.featureGroup();
    if(!commende.pointVente)
      return;
    if(!commende.pointVente.lat||!commende.pointVente.long)
        return;
  let marker: any = leaflet.marker([commende.pointVente.lat, commende.pointVente.long], {icon: blueIcon}).bindPopup(
    `<h2 style="font-weight: bold; font-size:1.9em">${commende.pointVente.nom}</h2>
    <p style="color:dimgray;font-size: 1.0em">${commende.pointVente.telephone}, ${commende.pointVente.type},${commende.pointVente.ville}, ${commende.pointVente.quartier}</p>
    <p style=""> ${commende.pointVente.adresse}</p>
    <p><b>${commende.date} </b> , ${commende.quantite} colis,${commende.ca} XAF</p>`)
    .openPopup()
    .on('click', () => {
      
    })
  markerGroup.addLayer(marker);
  this.map.addLayer(markerGroup);
});
}

  /* loadGoogleMaps(){
    this.addConnectivityListeners();
  if(typeof google == "undefined" || typeof google.maps == "undefined"){
    console.log("Google maps JavaScript needs to be loaded.");
    this.disableMap();

    if(this.connectivityService.isOnline()){
      console.log("online, loading map");
      //Load the SDK
      window['mapInit'] = () => {
        this.initMap();
        this.enableMap();
      }

      let script = document.createElement("script");
      script.id = "googleMaps";

      if(this.apiKey){
        script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
      } else {
        script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';       
      }
      document.body.appendChild(script); 
      
     /* let markerscript = document.createElement("script");
      markerscript.src='https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js'
      document.body.appendChild(markerscript); 
    } 
  }
  else {

    if(this.connectivityService.isOnline()){
      console.log("showing map");
      this.initMap();
      this.enableMap();
    }
    else {
      console.log("disabling map");
      this.disableMap();
    }

  }

   }*/

 /* disableMap(){
    console.log("disable map");
  }

  enableMap(){
    console.log("enable map");
  }


  initMap(){
    this.mapInitialised = true;
    this.connectivityService.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  })
  }

  addConnectivityListeners(){

    let onOnline = () => {

      setTimeout(() => {
        if(typeof google == "undefined" || typeof google.maps == "undefined"){

          this.loadGoogleMaps();

        } else {

          if(!this.mapInitialised){
            this.initMap();
          }

          this.enableMap();
        }
      }, 2000);

    };

    let onOffline = () => {
      this.disableMap();
    };

    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);

  }*/


}
