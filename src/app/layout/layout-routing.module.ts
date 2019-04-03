import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleType } from '../../typings-server/server-interfaces';
import { RoleGuard } from '../shared/routing/role.guard.service';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [
			{
				path: 'offers',
				loadChildren: './features/offers/offers.module#OffersModule',
				canActivate: [RoleGuard],
				data: { roles: [RoleType.ROLE_OFFER_READ] }
			},
			{
				path: 'operations',
				loadChildren: './features/operations/operations.module#OperationsModule',
				canActivate: [RoleGuard],
				data: { roles: [RoleType.ROLE_OPERATION_READ] }
			},
			{
				path: 'costs',
				loadChildren: './features/costs/costs.module#CostsModule',
				canActivate: [RoleGuard],
				data: { roles: [RoleType.ROLE_COST_READ] }
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers: [RoleGuard]
})
export class LayoutRoutingModule {}
