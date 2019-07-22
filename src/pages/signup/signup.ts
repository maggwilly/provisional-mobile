import { Component } from '@angular/core';
import {IonicPage,NavController,AlertController, LoadingController} from 'ionic-angular';
import {AppNotify} from '../../app/app-notify';
import { ManagerProvider } from '../../providers/manager/manager';

import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
   providers: [AppNotify]
})
export class SignupPage {
  submitted = false;
  round: boolean;
  stape='phone';
  expand: boolean;
  spinnerColor: string;
 
  public formPhone: FormGroup;
  public newUser: FormGroup;
  public formCode: FormGroup;

  public nom: FormControl;
  public email: FormControl;
  public code: FormControl;
  public phone: FormControl;
  public phone2: FormControl;
  public plainPassword: FormControl;
  public passwordConfirm: FormControl;

  public data: any={}
  public error: any;
  public loading;
  public masks: any;
  constructor(public navCtrl: NavController,
  public alertCtrl: AlertController,
  public loadingCtrl: LoadingController,
  public formBuilder: FormBuilder,
  public manager: ManagerProvider,
  public appNotify: AppNotify) {
  

    this.phone = new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern("[5-9]{1}[0-9]{8}")
    ]));

    this.phone2 = new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern("[5-9]{1}[0-9]{8}")
    ]));   

    this.code = new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(6)
    ]));

    this.nom = new FormControl('', Validators.compose([
      Validators.required
    ]));

    // @todo add better email-validation pattern...
    this.email = new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"),
    ]));


    this.plainPassword = new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(24)
    ]));

  
    this.passwordConfirm = new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(24),
    ]));

  
    this.formPhone = this.formBuilder.group({
      login: this.phone,
    });

    this.newUser = this.formBuilder.group({
      username: this.phone2,
      email: this.email,
      nom: this.nom
    });

    this.formCode = this.formBuilder.group({
      value: this.code,
    });
  }



  ionViewDidLoad() {
    console.log('Hello Signup Page');
  }
  

onSubmit(){
         this.submitted = true; 
         this.manager.post('register', this.newUser.value,'new',true).then(data => {
          this.submitted = false;
          this.data = data;
          console.log(data);
          if (data.value)
               this.stape = 'code';
        }, error => {
          this.submitted = false;
          console.log(error);
          this.appNotify.showAlert({message:'Le service peut-etre  indisponible. Verifiez votre connexion internet'})
        })
}

  nextStape() {
    switch (this.stape) {
      case 'phone':
        this.submitted = true;
        this.manager.post('token', this.formPhone.value,'new',true).then(data => {
          this.submitted = false;
          console.log(data);
          this.data = data;
          if (data.value)
            this.stape = 'code';
          else if (data.create) {
            this.stape = 'user';
            this.phone2.setValue(data.create.login)
          }

        }, error => {
          console.log(error);
          this.submitted = false;
          this.appNotify.showAlert({message:'Le service peut-etre  indisponible. Verifiez votre connexion internet'})
        })
        break;
      case 'code':
        this.submitted = true;
        let code: any = this.formCode.value
        code.user = this.data.user.id;
        this.manager.post('token', code, 'check',true).then(data => {
          this.submitted = false;
          if(data.error_code)
             return
          this.manager.storeUser(data).then(()=>{
            this.navCtrl.setRoot('MenuPage', {}, {animate: true, direction: 'forward'});
          }, error => {
            console.log(error);
            this.submitted = false;
            this.appNotify.showAlert({message:'Le service peut-etre  indisponible. Verifiez votre connexion internet'})
          })
         
        }, error => {
          console.log(error);
          this.submitted = false;
          this.appNotify.showAlert({message:'Le service peut-etre  indisponible. Verifiez votre connexion internet'})
        })
        break;
      default:
        break;
    }

  }

previewStape(){
  switch (this.stape){
  case 'user':
  case 'code':
      this.stape='phone';
      break;           
  default:
      break;
  }

}

isInvalid() {
  switch (this.stape){
  case 'phone': 
       return !this.formPhone.valid;
 case 'user':
      return !this.newUser.valid;
  case 'code':
      return !this.formCode.valid;
 
  }
    
  }


  login() {
        this.navCtrl.push('LoginPage');
    }

 
}
