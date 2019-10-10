import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, AlertController, NavParams } from 'ionic-angular';
import { ManagerProvider } from '../../providers/manager/manager';
import { AppNotify } from '../../app/app-notify';

@IonicPage()
@Component({
  selector: 'quartier',
  templateUrl: 'quartiers.html'
})
export class QuartiersPage {
  queryText: string;
  newQuartiers: any[] = [];
  ville: string = ''
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public notify: AppNotify,
    public alertCtrl: AlertController,
    public manager: ManagerProvider, ) {
    this.ville = this.navParams.get('ville')
  }

  ionViewDidEnter() {
    this.manager.getQuartiers().then((data) => {
      this.newQuartiers=data.filter(item=>{
        return item.ville==this.ville;
      })
    });

  }
  detail($event){

  }

  search() {
    let queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
    this.newQuartiers.forEach(item => {
      item.hide = true;
      this.filter(item, queryWords);
    });

  }
  filter(item, queryWords) {
    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach(queryWord => {
        if (item.nom && item.nom.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }
    item.hide = !(matchesQueryText);
  }

  dismiss(selectedItem?: any) {
    this.viewCtrl.dismiss(selectedItem);
  }

  exist(items, seach): any {
    let item = items.find((item) => {
      return (item.nom == seach);
    });
    return item;
  }

  add() {
    let self=this;
    this.notify.showAlert({
      subTitle:"Nouveau quartier",
      message:'Ajouter un nouveau quartier',
      inputs: [
        {
          name: 'nom',
          type: 'text',
          placeholder: 'Saisir le nom',
          value: ''
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Ajouter',
          handler: (data) => {
            self.dismiss(data.nom)
          }
        }
      ]
    })
}
}