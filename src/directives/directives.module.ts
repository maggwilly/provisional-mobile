import { NgModule } from '@angular/core';
import { LastcommendeDirective } from './lastcommende/lastcommende';
import { LastrendevousDirective } from './lastrendevous/lastrendevous';
import { HideHeaderDirective } from './hide-header/hide-header';
import { TotalDirective } from './total/total';
@NgModule({
	declarations: [LastcommendeDirective,
    LastrendevousDirective,
    HideHeaderDirective,
    TotalDirective],
	imports: [],
	exports: [LastcommendeDirective,
    LastrendevousDirective,
    HideHeaderDirective,
    TotalDirective]
})
export class DirectivesModule {}
