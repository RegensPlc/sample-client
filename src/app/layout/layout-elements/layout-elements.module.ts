import { NgModule } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { APP_MAT_DATE_FORMATS } from '../../shared/util/date-formatter';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { BreadcrumbService } from './breadcrumb/breadcrumb.service';
import { MenuComponent } from './menu/menu.component';
import { UserMenuComponent } from './user-menu/user-menu.component';

const publicApi = [BreadcrumbComponent, MenuComponent, UserMenuComponent];

@NgModule({
	imports: [SharedModule, RouterModule],
	declarations: [...publicApi],
	exports: [...publicApi],
	providers: [
		BreadcrumbService,
		{
			provide: MAT_DATE_FORMATS,
			useValue: APP_MAT_DATE_FORMATS
		}
	]
})
export class LayoutElementsModule {}
