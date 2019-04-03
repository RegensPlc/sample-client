import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Moment } from 'moment';
import { combineLatest, merge, Observable, of, Subject } from 'rxjs';
import {
	catchError,
	debounceTime,
	distinctUntilChanged,
	finalize,
	map,
	switchMap,
	tap
} from 'rxjs/operators';
import {
	CoworkerInfo,
	NameCodePair,
	NameIdPair,
	OfferData,
	OfferDetailInfo,
	PartnerAdministratorInfo
} from '../../../../../../typings-server/server-interfaces';
import { ComponentBase } from '../../../../../shared/component/component-base';
import { NavigationService } from '../../../../../shared/navigation/navigation.service';
import { NotificationService } from '../../../../../shared/notification/notification.service';
import { User } from '../../../../../shared/user/user';
import {
	localDateToMoment,
	momentToServerDateString
} from '../../../../../shared/util/date-formatter';
import { BreadcrumbService } from '../../../../layout-elements/breadcrumb/breadcrumb.service';
import { BreadcrumbItem } from '../../../../layout-elements/breadcrumb/model/breadcrumb-item';
import { SendOfferComponent } from '../send-offer/send-offer.component';
import { OfferDetailModel } from './offer-base-detail.model';
import { OfferBaseDetailService } from './offer-base-detail.service';

@Component({
	selector: 'ccd-offer-base-detail',
	templateUrl: './offer-base-detail.component.html',
	styleUrls: ['./offer-base-detail.component.scss'],
	providers: [OfferBaseDetailService]
})
export class OfferBaseDetailComponent extends ComponentBase implements OnInit {
	public get cannotSave(): boolean {
		return !this.model.group.dirty;
	}
	public get isReadonly(): boolean | null {
		return this._isReadonly;
	}
	public set isReadonly(value: boolean | null) {
		this._isReadonly = value;
		this.model.changeEnabled(!value);
	}
	private _isReadonly: boolean | null = null;
	public operationInProgress = false;
	public model: OfferDetailModel;
	public partnerSubject = new Subject<NameIdPair[]>();
	public partners$: Observable<NameIdPair[]> = <Observable<NameIdPair[]>>{};
	public allPartnerAdministrators: PartnerAdministratorInfo[] = [];
	public partnerAdministrators: PartnerAdministratorInfo[] = [];
	public coworkers: CoworkerInfo[] = [];

	@Input()
	public get offerId(): number {
		return this._offerId;
	}
	public set offerId(value: number) {
		this._offerId = value;
		this.getPreData(this._offerId);
	}
	private _offerId: number = 0;
	public offerStates: Array<NameCodePair> = [];
	public offerResults: Array<NameCodePair> = [];
	public paymentTypes: Array<NameCodePair> = [];
	public offerTypes: NameCodePair[] = [];
	public paymentCurrencies: NameCodePair[] = [];
	public offerLanguages: Array<NameCodePair> = [];
	public offerType = new Subject<NameCodePair>();
	public currentOffertype: Observable<NameCodePair> = <Observable<NameCodePair>>{};
	public partnerId: number = 0;

	@Output()
	public offerSent = new EventEmitter();

	constructor(
		private readonly service: OfferBaseDetailService,
		private readonly router: Router,
		formBuilder: FormBuilder,
		private readonly dialog: MatDialog,
		private readonly user: User,
		private readonly translateService: TranslateService,
		private readonly breadcrumbService: BreadcrumbService,
		private readonly notificationService: NotificationService,
		private readonly navigationService: NavigationService
	) {
		super();
		this.model = new OfferDetailModel(formBuilder);
	}

	ngOnInit() {
		this.initPartnerAutocomplete();
		this.currentOffertype = this.offerType.asObservable();
	}

	private getPreData(offerId: number): void {
		combineLatest(
			this.service.getCoworkers().pipe(
				tap(result => {
					this.coworkers = result;
				})
			),
			this.service.getOfferStates().pipe(
				tap(result => {
					this.offerStates = result;
				})
			),
			this.service.getOfferResults().pipe(
				tap(result => {
					this.offerResults = result;
				})
			),
			this.service.getPaymentTypes().pipe(
				tap(result => {
					this.paymentTypes = result;
				})
			),
			this.service.getPartnerAdministrators().pipe(
				tap(result => {
					this.allPartnerAdministrators = result;
				})
			),
			this.service.getOfferLanguages().pipe(
				tap(result => {
					this.offerLanguages = result;
				})
			)
		)
			.pipe(
				switchMap(() =>
					this.getData(offerId).pipe(finalize(() => (this.operationInProgress = false)))
				)
			)
			.subscribe();
	}

	public nameIdDisplayerFn(value: NameIdPair): String {
		return value ? value.displayName : '';
	}

	public handlePartnerSelect(event: MatAutocompleteSelectedEvent): void {
		const selectedPartner = event.option.value as NameIdPair;
		this.partnerId = selectedPartner.id;
		this.filterPartnerAdministrators();
	}

	private filterPartnerAdministrators(): void {
		this.partnerAdministrators = this.allPartnerAdministrators.filter(
			a => a.partnerId === this.partnerId
		);
	}

	private getData(offerId: number | null): Observable<null | OfferDetailInfo> {
		if (offerId) {
			return this.getDataForExisting(offerId);
		} else {
			this.setBreadcrumb(this.translateService.instant('App.Breadcrumbs.Offers.NewOffer'));
			return this.getDataForNew();
		}
	}

	private getDataForNew(): Observable<null> {
		const coworker = this.getCoworker(this.user.userName);
		this.model.applySource(this.model.createEmptySource({ coworker }));
		this.model.status.setValue(this.offerStates[0]);
		this.model.type.setValue(this.offerTypes[0]);
		this.model.result.setValue(this.offerResults[0]);
		this.model.languageCode.setValue(this.offerLanguages[0].code);
		this.model.paymentMethod.setValue(this.paymentTypes[0]);
		this.model.paymentCurrency.setValue(this.paymentCurrencies[0]);
		this.isReadonly = false;
		return of(null);
	}

	private getDataForExisting(offerId: number): Observable<OfferDetailInfo> {
		return this.service.getDetail(offerId).pipe(
			tap(offer => {
				this.setBreadcrumb(offer.year + '/' + offer.serial);
			}),
			switchMap(offer => of(offer)),
			tap(offer => {
				const {
					partner,
					liablePerson,
					partnerAdministrator,
					statusId,
					typeId,
					resultId,
					resultComment,
					paymentMethodId,
					paymentCurrencyId,
					paymentDays,
					comment,
					date,
					startOfValidity,
					endOfValidity,
					parityCode,
					parityComment,
					languageCode
				} = offer;

				const coworker = this.getCoworker(liablePerson);
				this.offerType.next(this.offerTypes.find(a => a.code === typeId));

				this.model.applySource({
					partner,
					coworker,
					partnerAdministrator: partnerAdministrator
						? this.allPartnerAdministrators.find(a => a.id === partnerAdministrator.id)
						: undefined,
					status: this.offerStates.find(a => a.code === statusId),
					type: this.offerTypes.find(a => a.code === typeId),
					result: this.offerResults.find(a => a.code === resultId),
					resultComment,
					paymentMethod: this.paymentTypes.find(a => a.code === paymentMethodId),
					paymentCurrency: this.paymentCurrencies.find(a => a.code === paymentCurrencyId),
					paymentDays,
					comment,
					date: localDateToMoment(date) as Moment,
					startOfValidity: localDateToMoment(startOfValidity) as Moment,
					endOfValidity: localDateToMoment(endOfValidity) as Moment,
					parityCode,
					parityComment,
					languageCode
				});

				// make sure that the 1st partner is selected
				this.partnerSubject.next([partner]);
				this.partnerId = partner.id;
				this.filterPartnerAdministrators();
				this.isReadonly = false;
			})
		);
	}

	private initPartnerAutocomplete(): void {
		this.partners$ = merge(
			this.partnerSubject.asObservable(),
			this.model.partner.valueChanges.pipe(
				debounceTime(200),
				distinctUntilChanged(),
				switchMap(value => {
					if (value && value.length > 2)
						return this.service.searchPartners(value).pipe(
							tap(options => {
								options.forEach(opt => (opt.displayName = opt.displayName.trim()));
							}),
							map(options =>
								options.sort((a, b) =>
									a.displayName
										.toLowerCase()
										.localeCompare(b.displayName.toLocaleLowerCase())
								)
							),
							catchError(() => of([]))
						);
					else return of([]);
				})
			)
		);
	}

	public handleSave(): void {
		this.model.markAsTouched();
		if (!this.model.group.valid) return;

		const data = this.getOfferDataFromForm();
		if (this.offerId) {
			this.operationInProgress = true;
			this.service
				.updateOffer(this.offerId, data)
				.pipe(
					switchMap(() => this.getData(this.offerId)),
					finalize(() => (this.operationInProgress = false))
				)
				.subscribe(() => {
					this.notificationService.showSuccess(
						this.translateService.instant('Concepts.Update_Success')
					);
				});
		} else {
			this.operationInProgress = true;
			this.service.createOffer(data).subscribe(
				async createdOfferId => {
					this.notificationService.showSuccess(
						this.translateService.instant('Concepts.Create_Success')
					);
					await this.router.navigateByUrl(
						this.navigationService
							.features()
							.offers()
							.offerDetailsUrl(createdOfferId)
					);
					this.offerId = createdOfferId;
					this.getData(createdOfferId)
						.pipe(finalize(() => (this.operationInProgress = false)))
						.subscribe();
				},
				() => (this.operationInProgress = false)
			);
		}
	}

	public getPdfUrl(): string {
		return `offers/${this.offerId}/pdf`;
	}

	public handleDownloadPdfPreview(): void {
		this.operationInProgress = true;
		this.service
			.downloadPdfPreview(this.getPdfUrl())
			.pipe(finalize(() => (this.operationInProgress = false)))
			.subscribe();
	}

	public storno(): void {
		this.operationInProgress = true;
		this.service
			.stornoOffer(this.offerId)
			.pipe(
				switchMap(() => this.getData(this.offerId)),
				finalize(() => (this.operationInProgress = false))
			)
			.subscribe(() => {
				this.notificationService.showSuccess(
					this.translateService.instant('Concepts.Storno_Success')
				);
			});
	}

	public duplicate(withItems: Boolean): void {
		this.operationInProgress = true;
		this.service.duplicateOffer(this.offerId, withItems).subscribe(
			createdOfferId => {
				this.notificationService.showSuccess(
					this.translateService.instant('Concepts.Duplication_Success', {
						id: createdOfferId
					})
				);
			},
			() => (this.operationInProgress = false)
		);
	}

	public openSendOfferPopup(): void {
		this.dialog
			.open(SendOfferComponent, {
				minWidth: 400,
				data: {
					offerId: this.offerId,
					partnerAdmininstrator: this.model.partnerAdministrator.value
						? this.model.partnerAdministrator.value.id
						: null
				}
			})
			.afterClosed()
			.subscribe((success: boolean) => {
				if (success) {
					this.offerSent.emit();
				}
			});
	}

	private getCoworker(coworkerUserName: string): string | undefined {
		// if this is a new operation, try apply the coworkers that belongs to the current user
		// otherwise use the ones come down from the request
		const coworker = this.coworkers.find(a => a.userCode === coworkerUserName);
		return coworker ? coworker.userCode : undefined;
	}

	private setBreadcrumb(lastItemText: string): void {
		const breadcrumbItems: BreadcrumbItem[] = [
			new BreadcrumbItem(
				this.translateService.instant('App.Breadcrumbs.Offers.OfferHandling'),
				this.navigationService
					.features()
					.operations()
					.getOperationListUrl()
			),
			new BreadcrumbItem(lastItemText, null)
		];
		this.breadcrumbService.setBreadcrumbItems(breadcrumbItems);
	}

	private getOfferDataFromForm(): OfferData {
		return {
			partnerId: (this.model.partner.value as NameIdPair).id,
			liablePerson: this.model.coworker.value,
			partnerAdministrator: this.model.partnerAdministrator.value
				? this.model.partnerAdministrator.value.id
				: null,
			status: (this.model.status.value as NameCodePair).code,
			typeId: (this.model.type.value as NameCodePair).code,
			resultId: (this.model.result.value as NameCodePair).code,
			resultComment: this.model.resultComment.value,
			paymentMethod: (this.model.paymentMethod.value as NameCodePair).code,
			paymentCurrency: (this.model.paymentCurrency.value as NameCodePair).code,
			paymentDays: this.model.paymentDays.value,
			comment: this.model.comment.value,
			date: momentToServerDateString(this.model.date.value) as string,
			startOfValidity: momentToServerDateString(this.model.startOfValidity.value) as string,
			endOfValidity: momentToServerDateString(this.model.endOfValidity.value) as string,
			parityCode: this.model.parityCode.value,
			parityComment: this.model.parityComment.value,
			languageCode: this.model.languageCode.value
		};
	}
}
