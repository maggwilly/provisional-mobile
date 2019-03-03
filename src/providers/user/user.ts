
import { Injectable } from '@angular/core';
import { ManagerProvider} from '../manager/manager';
import { Storage } from '@ionic/storage';
import {  Events, App } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase/ngx';
/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
   public user
   public amParent:boolean;
   public registrationid:string=window.localStorage.getItem('token_registration');
   complete = null
  constructor(
    public manager: ManagerProvider,
    public storage:Storage,
    public app: App,
    private firebase: Firebase,
    public events: Events) {
  
    this.storage.get('user').then((data)=>{
      if(!data)
         return this.go()
      this.user=data;    
      this.manager.show('user',manager.getUserId()).then((data)=>{
      this.user.parent=data;
      this.amParent=this.amIMyParent();
      this.storage.set('user',this.user)
      this.events.publish('user.login', {
        user: this.user
      });
    },error=>{
      console.log(error)
      this.events.publish('auth', error)
    })
  })
  this.complete = this.makeComplete();
 
  }

  public go() {
		//this.nav.setRoot(LoginPage, {}, {animate: false})
		this.app.getRootNav().setRoot('SignupPage', {}, {animate: false})
  }

  public request(requests:any[]){
    this.app.getRootNav().setRoot('RequestsPage', {requests:requests}, {animate: false})
  }
  
  public profile(user:any){
    console.log(user)
    this.app.getRootNav().setRoot('ProfilePage', {user : user}, {animate: false})
  }

  public shoulpay(abonnement:any){
      this.app.getRootNav().setRoot('ShoulPayPage', {abonnement : abonnement}, {animate: false})
  }
public amIMyParent(){
   if(!this.user||!this.user.parent)
     return
  return (this.user.id==this.user.parent.id);
}
	public makeComplete() {
		let self = this;
		return new Promise((resolve, reject) => {
			if (self.user) {
				resolve(self.user);
				return;
			}
			
			self.events.subscribe('user.login', data => {
			  	resolve(data.user);
			});
			 self.events.subscribe('auth', (pb) => {
        console.log(pb)
				resolve();
			});
		
		})
  };  
  



  
  getToken(){
    this.firebase.getToken().then(token => {
      this.registrationid=token;
      window.localStorage.setItem('token_registration', token)
    });
    this.firebase.onTokenRefresh().subscribe(token => {
      this.registrationid=token;
      window.localStorage.setItem('token_registration', token)
    }); 
    this.complete.then(user => {
      this.register(user) ;
    }) 
  }





   onNotification() {
    this.firebase.onNotificationOpen().subscribe(data => {
    if (data.tap) {
      if (data.page) {
        switch (data.page) {
        case 'should_pay':
        this.app.getActiveNav().setRoot('ShouldPayPage');
          break;
        default:
        this.app.getActiveNav().setRoot('PointVenteDetailPage',{pointVente:data.pointVente});
          break;
      }  
    }
  }});
  }



  register(user:any){
    if (!user||!user.id||!user.parent||!this.registrationid)
           return
         user.registration=this.registrationid;
    this.firebase.subscribe('user-'+user.parent.id);  
    this.manager.put('user',user).then(data=>{
    },error=>{
      //this.notify.onSuccess({message:"PROBLEME ! votre connexion internet est peut-être instable"})
    })
  }
}
