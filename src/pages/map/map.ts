import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LocalisationProvider } from '../../providers/localisation/localisation';
import { greenIcon }  from  '../../app/icons-marker';
import leaflet from 'leaflet';
import 'leaflet-routing-machine'
import { AppNotify } from '../../app/app-notify';

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
  apiKey: any="AIzaSyBNIN0oMzHoNgEZz1utnM_8ut6KFjwieoo";
   
  allpoint:boolean;
  polyline:boolean;
  difference:boolean;
  points:any[]=[];
  waypoints:any[]=[]
  title:string;
  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public notify: AppNotify,
    public connectivityService: LocalisationProvider,
    public navParams: NavParams) {
    this.title=this.navParams.get('title');
    this.points=this.navParams.get('points');
    console.log(this.points);
    
   // this.loadGoogleMaps();
  }

  ionViewDidEnter() {
      this.connectivityService.getCurrentPosition().then((position) => {
        console.log(position);
     /* this.waypoints.push(leaflet.latLng(position.coords.latitude, position.coords.longitude))
      this.points.forEach(point => {
        this.waypoints.push(leaflet.latLng(point.pos.lat, point.pos.long))
      });*/
      if(this.connectivityService.isOnline()){
        if(!position.coords.latitude||!position.coords.longitude)
        return  this.notify.onError({ message: "Problème de centralisation de la carte. Verifiez votre connexion internet", duration:500000 });
         this.loadmap(position.coords);
      }else
          this.notify.showAlert({ message: "Activez votre connexion internet"})
      },error=>{
        this.notify.onError({ message: "Problème de centralisation de la carte. Verifiez votre connexion internet", duration:500000 })
      console.log(error); 
      })
     
    
   }

   loadmap(coords?:any) {

    this.map = leaflet.map('map', {
      center: [coords.latitude, coords.longitude],
      zoom: 45
  });
   leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      zoom: 45,
      minResolution: 4891.96981025128,
      maxResolution: 39135.75848201024,
      doubleClickZoom: true,
      center: [coords.latitude, coords.longitude]
    }).addTo(this.map)

   this.points.forEach(point => {
      let markerGroup = leaflet.featureGroup();
    let marker: any = leaflet.marker([point.pos.lat, point.pos.long], {icon: greenIcon}).on('click', () => {
      alert('Marker clicked');
    })
    markerGroup.addLayer(marker);
    this.map.addLayer(markerGroup);
 });

     /* leaflet.Routing.control({ 
        waypoints: this.waypoints,
         routeWhileDragging: false ,
         showAlternatives:true,
         show:false,
    }).addTo(this.map);*/
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
