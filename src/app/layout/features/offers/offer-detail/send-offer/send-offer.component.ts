import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '../../../../../../../node_modules/@angular/forms';
import { NotificationService } from './../../../../../shared/notification/notification.service';
import { SendOfferModel } from './send-offer.model';
import { SendOfferService } from './send-offer.service';

@Component({
	selector: 'ccd-send-offer',
	templateUrl: './send-offer.component.html',
	styleUrls: ['./send-offer.component.scss'],
	providers: [SendOfferService]
})
export class SendOfferComponent implements OnInit {
	public model: SendOfferModel;

	public operationInProgress = false;

	private readonly offerId: number;
	private readonly partnerAdmininstrator: number | null;

	constructor(
		public dialogRef: MatDialogRef<SendOfferComponent>,
		@Inject(MAT_DIALOG_DATA)
		public data: { offerId: number; partnerAdmininstrator: number | null },
		fb: FormBuilder,
		private readonly service: SendOfferService,
		private readonly notificationService: NotificationService,
		private readonly translateService: TranslateService
	) {
		this.offerId = data.offerId;
		this.partnerAdmininstrator = data.partnerAdmininstrator;
		this.model = new SendOfferModel(fb);
	}

	ngOnInit(): void {
		if (this.partnerAdmininstrator) {
			this.service.getPartnerEmail(this.partnerAdmininstrator).subscribe(emailInfo =>
				this.model.applySource({
					message: this.translateService.instant('Offers.SendOffer.Predefined_Message'),
					recipients: emailInfo.email
				})
			);
		} else {
			this.model.message.setValue(
				this.translateService.instant('Offers.SendOffer.Predefined_Message')
			);
		}
	}

	public onSendOffer(): void {
		this.model.markAsTouched();
		if (this.model.group.invalid) return;

		this.dialogRef.disableClose = true;
		this.operationInProgress = true;

		this.service.sendOffer(this.offerId, this.model.getSource()).subscribe(
			() => {
				this.notificationService.showSuccess(
					this.translateService.instant('Offers.SendOffer.Successful_Sending')
				);
				this.dialogRef.close(true);
			},
			() => {
				this.operationInProgress = false;
				this.dialogRef.disableClose = false;
			}
		);
	}
}
