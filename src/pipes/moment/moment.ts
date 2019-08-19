import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
/**
 * Generated class for the MomentPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'moment',
})
export class MomentPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(date, method?:string) {
    if(!method)
        return this.fromNow(date);
    return moment(date).fromNow();
  }

  fromNow(date){
    return moment(date).calendar();
  }
}
