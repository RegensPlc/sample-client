import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfferListComponent } from './offer-list/offer-list.component';
import { OfferDetailComponent } from './offer-detail/offer-detail.component';

const routes: Routes = [
	{
		path: '',
		component: OfferListComponent
	},
	{
		path: ':id',
		component: OfferDetailComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class OffersRoutingModule { }
