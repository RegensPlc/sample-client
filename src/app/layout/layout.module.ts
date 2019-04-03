import { NgModule } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { APP_MAT_DATE_FORMATS } from '../shared/util/date-formatter';
import { LayoutElementsModule } from './layout-elements/layout-elements.module';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';

@NgModule({
	imports: [SharedModule, LayoutRoutingModule, LayoutElementsModule],
	declarations: [LayoutComponent],
	providers: [
		{
			provide: MAT_DATE_FORMATS,
			useValue: APP_MAT_DATE_FORMATS
		}
	]
})
export class LayoutModule {}
