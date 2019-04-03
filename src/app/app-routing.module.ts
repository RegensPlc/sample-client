import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInGuardService } from './shared/routing/logged-in-guard.service';
import { LoggedOutGuardService } from './shared/routing/logged-out-guard.service';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'login',
				loadChildren: './login/login.module#LoginModule',
				canActivate: [LoggedOutGuardService]
			},
			{
				path: '',
				loadChildren: './layout/layout.module#LayoutModule',
				canActivate: [LoggedInGuardService]
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
	providers: [LoggedInGuardService, LoggedOutGuardService]
})
export class AppRoutingModule {}
