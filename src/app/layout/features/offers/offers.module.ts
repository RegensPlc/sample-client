import { NgModule } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material';
import { APP_MAT_DATE_FORMATS } from '../../../shared/util/date-formatter';
import { SharedModule } from './../../../shared/shared.module';
import { OfferBaseDetailComponent } from './offer-detail/offer-base-detail/offer-base-detail.component';
import { OfferDetailComponent } from './offer-detail/offer-detail.component';
import { OfferItemsComponent } from './offer-detail/offer-items/offer-items.component';
import { SendOfferComponent } from './offer-detail/send-offer/send-offer.component';
import { OfferListComponent } from './offer-list/offer-list.component';
import { SearchFormStateService } from './offer-list/offer-list.model';
import { OffersRoutingModule } from './offers-routing.module';

@NgModule({
	imports: [SharedModule, OffersRoutingModule],
	declarations: [
		OfferListComponent,
		OfferDetailComponent,
		OfferBaseDetailComponent,
		OfferItemsComponent,
		SendOfferComponent
	],
	providers: [
		{
			provide: MAT_DATE_FORMATS,
			useValue: APP_MAT_DATE_FORMATS
		},
		SearchFormStateService
	],
	entryComponents: [SendOfferComponent]
})
export class OffersModule {}
