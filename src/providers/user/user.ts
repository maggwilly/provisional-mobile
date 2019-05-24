
import { Injectable } from '@angular/core';
import { ManagerProvider } from '../manager/manager';
import { Storage } from '@ionic/storage';
import { Events, App } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Observable, BehaviorSubject } from 'rxjs';



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
    public storage: Storage,
    public app: App,
    private firebase: Firebase,
    public events: Events) {
    this.resetObserver();
  }

  public resetObserver() {
    this.user = null;
    this.storage.get(`user_id_${this.manager.getUserId()}`).then((data) => {
      if (!data)
        return this.go()
      this.user = data;
      this.authenticatedUser.next(this.user)
      this.manager.show('user', this.manager.getUserId()).then((user) => {
        //console.log(user);
        if (!user)
          return this.events.publish('auth', user);
        this.user.parent = user.parent;
        this.user.receiveRequests = user.receiveRequests;
        this.storage.set(`user_id_${this.manager.getUserId()}`,this.user)
        this.amParent = this.amIMyParent();
        this.storage.set('user', this.user)
        this.events.publish('user.login', {
          user: this.user
        });
      }, error => {
        console.log(error);
        this.events.publish('auth', { error: true })
      })
    })
    this.complete = this.makeComplete();
  }


  getAuthenticatedUser() {
   return  this.authenticatedUser;
    
  }

  public go() {
    //this.nav.setRoot(LoginPage, {}, {animate: false})
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
      if (self.user) {
        resolve(self.user);
        return;
      }
      self.events.subscribe('user.login', data => {
        resolve(data.user);
      });
      self.events.subscribe('auth', (pb) => {
      //  console.log(pb)
        resolve(pb);
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
    this.complete.then(user => {
      this.register(user);
    })
  }


  logout() {
    this.storage.set('user', undefined).then(() => {
      this.authenticatedUser.next(null)
      this.go();
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
