import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { zip } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NameCodePair } from '../../../../../typings-server/server-interfaces';
import { ComponentBase } from '../../../../shared/component/component-base';
import { DocumentsComponent } from '../../../../shared/documents/documents.component';
import { DatabaseDocumentType } from '../../../../shared/documents/model';
import { OfferBaseDetailComponent } from './offer-base-detail/offer-base-detail.component';
import { OfferDetailService } from './offer-detail.service';
import { OfferItemsComponent } from './offer-items/offer-items.component';

@Component({
	selector: 'ccd-offer-detail',
	templateUrl: './offer-detail.component.html',
	styleUrls: ['./offer-detail.component.scss'],
	providers: [OfferDetailService]
})
export class OfferDetailComponent extends ComponentBase implements OnInit {
	public offerId: number = 0;
	public documentType = DatabaseDocumentType.Offer;
	public offerTypes: Array<NameCodePair> = Array<NameCodePair>();
	public paymentCurrencies: Array<NameCodePair> = Array<NameCodePair>();
	@ViewChild(OfferBaseDetailComponent)
	public offerBaseDetailComponent: OfferBaseDetailComponent = <OfferBaseDetailComponent>{};
	@ViewChild(OfferItemsComponent)
	public offerItemsComponent: OfferItemsComponent = <OfferItemsComponent>{};

	@ViewChild(DocumentsComponent)
	public documentsComponent: DocumentsComponent = <DocumentsComponent>{};

	constructor(private readonly route: ActivatedRoute, private service: OfferDetailService) {
		super();
	}

	ngOnInit() {
		zip(this.service.getOfferTypes(), this.service.getPaymentCurrencies())
			.pipe(
				tap(([offerTypes, currencies]) => {
					this.offerTypes = offerTypes;
					this.paymentCurrencies = currencies;

					this.addManagedSubscription(
						this.route.paramMap.subscribe(params => {
							this.offerId = +(params.get('id') || '');
						})
					);

					this.offerBaseDetailComponent.offerTypes = this.offerTypes;
					this.offerBaseDetailComponent.paymentCurrencies = this.paymentCurrencies;

					this.offerItemsComponent.offerTypes = this.offerTypes;
					this.offerItemsComponent.paymentCurrencies = this.paymentCurrencies;
					this.offerBaseDetailComponent.currentOffertype.subscribe(
						type => (this.offerItemsComponent.model.baseDetailOfferType = type)
					);
				})
			)
			.subscribe();
	}

	public handleOfferSent(): void {
		// refresh the documents list because the newly sent pdf has just been added to the database
		this.documentsComponent.getData().subscribe();
	}
}
