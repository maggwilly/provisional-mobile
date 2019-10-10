import { Directive, Input } from '@angular/core';
import { ManagerProvider } from '../../providers/manager/manager';
/**
 * Generated class for the TotalDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[total]' // Attribute selector
})
export class TotalDirective {
  @Input()
  commende:any
  constructor(public manager: ManagerProvider) {}
  ngOnInit() {
    if(!this.commende||!this.commende.lignes||!this.commende.lignes.length)
       return;

       this.commende.total=0;
       this.commende.lignes.forEach(ligne => {
        console.log(ligne);
         if(ligne.quantite&&ligne.pu)
          this.commende.total+=ligne.quantite*ligne.pu;

       });
  }

  ngOnChanges()  {
    this.ngOnInit() ;
  }
}
