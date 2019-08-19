import { Directive, Input } from '@angular/core';
import { ManagerProvider } from '../../providers/manager/manager';
import { LocalisationProvider } from '../../providers/localisation/localisation';
/**
 * Generated class for the LastrendevousDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[lastrendevous]' // Attribute selector
})
export class LastrendevousDirective {
  @Input()
  pointvente:any
  constructor(public manager: ManagerProvider,public connectivityService: LocalisationProvider) { }


  ngOnInit() {
    if(!this.pointvente||!this.pointvente.rendezvous)
       return;
       this.pointvente.rendezvous.loading=true;
    this.manager.show('rendezvous',this.pointvente.id,this.connectivityService.isOnline()).then((data)=>{
      if(data)
          this.pointvente.rendezvous=data;    
    },error=>{
      this.pointvente.rendezvous.loading=true;
    })
  }

  ngOnChanges()  {
    this.ngOnInit() ;
  }

}
