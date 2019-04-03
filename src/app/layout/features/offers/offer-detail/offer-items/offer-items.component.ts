import { Component, Input } from '@angular/core';
import { ComponentBase } from '../../../../../shared/component/component-base';
import { OfferItemsModel } from './offer-items.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OfferItemsService } from './offer-items.service';
import {
	NameCodePair,
	OfferItemData,
	CityInfo
} from '../../../../../../typings-server/server-interfaces';
import { tap, finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../../../shared/notification/notification.service';
import { Observable, Subject } from 'rxjs';
import { OfferItemsFormGroup } from './offer-items-form-group';
import { MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
	selector: 'ccd-offer-items',
	templateUrl: './offer-items.component.html',
	styleUrls: ['./offer-items.component.scss'],
	providers: [OfferItemsService]
})
export class OfferItemsComponent extends ComponentBase {
	public get cannotSave(): boolean {
		return this.model.deleted.length === 0 && !this.model.group.dirty;
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
	@Input()
	public get offerId(): number {
		return this._offerId;
	}
	public set offerId(value: number) {
		this._offerId = value;
		if (this._offerId) {
			this.getData();
		}
	}
	private _offerId: number = 0;
	public model: OfferItemsModel;
	public offerTypes: Array<NameCodePair> = [];
	public paymentCurrencies: Array<NameCodePair> = [];
	public baseDetailOfferType: NameCodePair | null = null;
	public citySubject = new Subject<CityInfo[]>();
	public cities$: Observable<CityInfo[]> = <Observable<CityInfo[]>>{};

	constructor(
		private readonly service: OfferItemsService,
		private translateService: TranslateService,
		private notificationService: NotificationService,
		formBuilder: FormBuilder
	) {
		super();
		this.model = new OfferItemsModel(
			formBuilder,
			this.offerTypes,
			this.paymentCurrencies,
			this.baseDetailOfferType,
			value => this.service.searchCities(value)
		);
	}

	private getData() {
		this.service.getOfferItems(this.offerId).subscribe(result => {
			this.model.offerTypes = this.offerTypes;
			this.model.paymentCurrencies = this.paymentCurrencies;
			this.model.applySource(result);
		});
	}

	public handleSave() {
		this.model.markAsTouched();
		if (this.model.deleted.length === 0 && !this.model.group.valid) return;

		const newElements: OfferItemData[] = Array<OfferItemData>();
		const updatedElements: OfferItemData[] = Array<OfferItemData>();

		this.model.getSource().forEach(item => {
			if (!item.id) {
				newElements.push(item);
			} else {
				const control = this.model.array.controls.find(
					a => (a as FormGroup).controls['id'].value === item.id
				);
				if (control && control.touched) updatedElements.push(item);
			}
		});

		this.operationInProgress = true;
		this.service
			.saveOfferItems(this.offerId, {
				newElements: newElements,
				deletedElements: this.model.deleted,
				updatedElements: updatedElements
			})
			.pipe(
				tap(() => this.getData()),
				finalize(() => (this.operationInProgress = false))
			)
			.subscribe(() => {
				this.notificationService.showSuccess(
					this.translateService.instant('Concepts.Save_Success')
				);
				this.model.deleted = [];
			});
	}

	public onNewItem(): void {
		this.model.addNewItem();
	}

	public onDeleteItem(item: OfferItemsFormGroup): void {
		this.model.deleteItem(item);
	}

	public onCopyItem(item: OfferItemsFormGroup): void {
		this.operationInProgress = true;
		this.service
			.duplicateOfferItem(this.offerId, item.controls['id'].value)
			.pipe(
				tap(() => this.getData()),
				finalize(() => (this.operationInProgress = false))
			)
			.subscribe(() => {
				this.notificationService.showSuccess(
					this.translateService.instant('Concepts.Duplication_Success')
				);
			});
	}

	public cityDisplayerFn(value: CityInfo): string {
		return value ? value.zipCode + ' (' + value.city + ')' : '';
	}

	public serialDisplayerFn(value: string): string {
		return value ? value : this.translateService.instant('Concepts.New');
	}

	public handleUpZipCodeSelect(event: MatAutocompleteSelectedEvent, group: FormGroup): void {
		const selectedCity = event.option.value as CityInfo;
		group.controls['upCode'].setValue(selectedCity.country);
		group.controls['upCityCode'].setValue(selectedCity.city);
	}

	public handleDownZipCodeSelect(event: MatAutocompleteSelectedEvent, group: FormGroup): void {
		const selectedCity = event.option.value as CityInfo;
		group.controls['downCode'].setValue(selectedCity.country);
		group.controls['downCityCode'].setValue(selectedCity.city);
	}
}
