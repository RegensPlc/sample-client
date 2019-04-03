import { NgModule } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { APP_MAT_DATE_FORMATS } from '../shared/util/date-formatter';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
	imports: [SharedModule, LoginRoutingModule],
	declarations: [LoginComponent],
	providers: [
		{
			provide: MAT_DATE_FORMATS,
			useValue: APP_MAT_DATE_FORMATS
		}
	]
})
export class LoginModule {}
