import { Component } from '@angular/core';
import { ManagerProvider } from '../../providers/manager/manager';
import { IonicPage, NavParams, NavController, ViewController } from 'ionic-angular';
import { AppNotify } from '../../app/app-notify';
import { LocalisationProvider } from '../../providers/localisation/localisation';

/**
 * Generated class for the SecteurPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-secteur',
  templateUrl: 'secteur.html',
})
export class SecteurPage {
  secteur: any = {}
  inset: boolean = true;
  openAddPage: boolean
  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public notify: AppNotify,
    public manager: ManagerProvider,
    public location: LocalisationProvider,
    public navParams: NavParams) {
    this.openAddPage = this.navParams.get('openAddPage')
    this.inset = this.navParams.get('inset');
      this.secteur = this.navParams.get('secteur') ? this.navParams.get('secteur') : {}
      console.log(this.secteur);
  }

  ionViewDidLoad() {
    if (this.secteur.id)
      return;
    this.location.getCurrentPosition().then((resp) => {
      this.secteur.latitude = resp.coords.latitude;
      this.secteur.longitude = resp.coords.longitude;
    }).catch((error) => {
      console.log(error);
    });
  }


  dismiss(data?: any) {
    this.viewCtrl.dismiss(data)
  }

  isInvalid(): boolean {
    return (!this.secteur.nom || !this.secteur.ville);
  }


  onSubmit() {
    this.secteur.change = true;
    let self = this;
    let loader = this.notify.loading({
      content: "Enregistrement...",
    });
    this.manager.save('secteur', this.secteur).then((data) => {
      loader.dismiss().then(() => {
        if (!data.error) {
          self.dismiss(data);
          return this.notify.onSuccess({ message: "Enregistrement effectué" })
        }
        this.notify.onError({ message: "Une erreur s'est produite et l'opération n'a pas put se terminer correctement" })

      });

    }, error => {
      loader.dismiss()
      this.notify.onError({ message: " Verifiez votre connexion internet" })
    })
    loader.present();
  }


  deleteItem() {
    let self = this;
    this.notify.showAlert({
      title: "Suppression",
      message: "Voulez-vous supprimer cet element ?",
      buttons: [
        {
          text: 'Annuler',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Supprimer',
          handler: (data) => {
            let loader = this.notify.loading({
              content: "Suppression...",
            });
            this.manager.delete('secteur', this.secteur).then(data => {
              if (data.ok) {
                loader.dismiss().then(() => {
                  self.dismiss(data);
                  this.notify.onSuccess({ message: "Element supprime" })
                });
              } else {
                loader.dismiss()
                this.notify.onError({ message: "Cet element est lie a d'autres. Vous ne pouvez pas le supprimer" })
              }
            }, error => {
              loader.dismiss()
              this.notify.onError({ message: "Un probleme est survenu" })
            })
            loader.present();
          }
        }
      ]
    })

  }

}
