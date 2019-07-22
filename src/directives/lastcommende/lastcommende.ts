import { Directive, Input } from '@angular/core';
import { ManagerProvider } from '../../providers/manager/manager';
/**
 * Generated class for the LastcommendeDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[lastcommende]' // Attribute selector
})
export class LastcommendeDirective {
 @Input()
 pointvente:any
  constructor(public manager: ManagerProvider) {
   
  }

  ngOnInit() {
    console.log('Hello LastcommendeDirective Directive');
    if(this.pointvente&&this.pointvente.lastCommende)
    this.manager.show('commende',this.pointvente.lastCommende.id).then((data)=>{
      if(data)
        this.pointvente.lastCommende=data;
        console.log(data);
        
    })
  }

  ngOnChanges()  {
    this.ngOnInit() ;
  }
}
