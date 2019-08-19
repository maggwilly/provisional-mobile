
import { Injectable } from '@angular/core';
import { ManagerProvider } from '../manager/manager';
import { Storage } from '@ionic/storage';
import { Events, App } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase/ngx';
import { BehaviorSubject } from 'rxjs';
import { LocalisationProvider } from '../localisation/localisation';



/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  public user
  public amParent: boolean;
  public registrationid: string = window.localStorage.getItem('token_registration');
  protected authenticatedUser: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  complete = null
  constructor(
    public manager: ManagerProvider,
    public connectivityService: LocalisationProvider,
    public storage: Storage,
    public app: App,
    private firebase: Firebase,
    public events: Events) {
      this.events.subscribe('last:status',(isConnected)=>{
        this.unavailable();
     })
    this.resetObserver();
  }

  public resetObserver() {
    this.complete = this.makeComplete(); 
    //this.user = null;
    console.log(this.manager.getUserId());
    if(!this.manager.getUserId()||"null"==this.manager.getUserId())
        return this.events.publish('auth', null);
        console.log(this.manager.getUserId());
    this.manager.show('token',this.manager.getUserId(),this.connectivityService.isOnline()).then((data) => {
      if (!data)
      return this.events.publish('auth', null)
        this.user = data;
        this.authenticatedUser.next(this.user)
        this.manager.show('user', this.manager.getUserId(),this.connectivityService.isOnline()).then((user) => {      
        if (!this.user)
          return  this.go(user);
        this.user.parent = user.parent;
        this.user.receiveRequests = user.receiveRequests;
        this.manager.storeEntityLocally(`user`,this.user)
        this.amParent = this.amIMyParent();
        this.events.publish('user.login', {
          user: this.user
        });
      }, error => {
        this.events.publish('error', error)
      })
    }, error => {
      this.events.publish('error', error)
    })
   
  }


  getAuthenticatedUser() {
   return  this.authenticatedUser;
    
  }

  public go(user) {
    console.log(user);
    
    this.app.getRootNav().setRoot('SignupPage', {}, { animate: false })
  }

  public request(requests: any[]) {
    this.app.getRootNav().setRoot('RequestsPage', { requests: requests }, { animate: false })
  }

  public profile(user: any) {
    this.app.getRootNav().setRoot('ProfilePage', { user: user })
  }

  public shoulpay(abonnement: any) {
    this.app.getRootNav().setRoot('ShoulPayPage', { abonnement: abonnement })
  }

  unavailable() {
    this.app.getRootNav().setRoot('UnavailablePage')
  }
  public amIMyParent() {
    if (!this.user || !this.user.parent)
      return
    return (this.user.id == this.user.parent.id);
  }



  public makeComplete() {
    
    let self = this;
    return new Promise((resolve, reject) => {
      if (self.user&&self.user.parent) {
        resolve(self.user);
        return;
      }
      self.events.subscribe('user.login', data => {
        resolve(data.user);
      });
      self.events.subscribe('auth', (pb) => {
       resolve(pb);
      });
      self.events.subscribe('error', (error) => {
        reject(error);
       });
    })
  };





  getToken() {
    this.firebase.getToken().then(token => {
      this.registrationid = token;
      window.localStorage.setItem('token_registration', token)
    });
    this.firebase.onTokenRefresh().subscribe(token => {
      this.registrationid = token;
      window.localStorage.setItem('token_registration', token)
    });
    this.getAuthenticatedUser().subscribe(user=>{
      if(user)
      this.register(user);
    })    
  }


  logout() {
    this.manager.removeUser().then(() => {
      this.storage.clear();
      this.authenticatedUser.next(null)
      this.go(this.user);
    }
    )
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
              this.app.getActiveNav().setRoot('PointVenteDetailPage', { pointVente: data.pointVente });
              break;
          }
        }
      }
    });
  }



  register(user: any) {

    if (!user || !user.id || !user.parent || !this.registrationid)
      return
    user.registration = this.registrationid;
    this.firebase.subscribe('user-' + user.parent.id);
    this.manager.put('user', user).then(data => {
    }, error => {
      //this.notify.onSuccess({message:"PROBLEME ! votre connexion internet est peut-être instable"})
    })
  }
}
