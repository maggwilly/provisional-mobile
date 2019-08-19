import { NgModule } from '@angular/core';
import { LastcommendeDirective } from './lastcommende/lastcommende';
import { LastrendevousDirective } from './lastrendevous/lastrendevous';
import { HideHeaderDirective } from './hide-header/hide-header';
@NgModule({
	declarations: [LastcommendeDirective,
    LastrendevousDirective,
    HideHeaderDirective],
	imports: [],
	exports: [LastcommendeDirective,
    LastrendevousDirective,
    HideHeaderDirective]
})
export class DirectivesModule {}
