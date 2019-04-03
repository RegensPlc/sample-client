import {
	changeEnabledOfControls,
	FormModelBase,
	markControlsAsTouched
} from '../../../../../shared/form/form-model-base';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
	OfferItemData,
	NameCodePair,
	CityInfo
} from '../../../../../../typings-server/server-interfaces';
import { momentDate, momentToServerDateString } from '../../../../../shared/util/date-formatter';
import { Observable, of } from 'rxjs';
import { OfferItemsFormGroup } from './offer-items-form-group';
import {
	debounceTime,
	distinctUntilChanged,
	switchMap,
	tap,
	map,
	catchError
} from 'rxjs/operators';

export interface OfferItemsFormSource {
	id?: number;
	serial?: number;
	type?: NameCodePair;
	weight?: number;
	volume?: number;
	naturalia?: string;
	productType?: string;
	value?: number;
	currency?: NameCodePair;
	comment?: string;
	upDate?: momentDate;
	upCode?: string;
	upCompany?: string;
	upZipCode?: string;
	upCityCode?: number;
	upAddress?: string;
	upComment?: string;
	downDate?: momentDate;
	downCode?: string;
	downCompany?: string;
	downZipCode?: string;
	downCityCode?: number;
	downAddress?: string;
	downComment?: string;
}

export class OfferItemsModel extends FormModelBase<OfferItemsFormSource[]> {
	public array: FormArray;
	public group: FormGroup;
	public deleted: number[] = [];

	constructor(
		private fb: FormBuilder,
		public offerTypes: NameCodePair[],
		public paymentCurrencies: NameCodePair[],
		public baseDetailOfferType: NameCodePair | null,
		private readonly oncityChanged: (value: string) => Observable<CityInfo[]>
	) {
		super();

		this.array = this.fb.array([]);
		this.group = fb.group({
			array: this.array
		});

		this.setControlValue([]);
	}

	public getSource(): OfferItemData[] {
		return this.array.controls.map(
			(a: any) =>
				<OfferItemData>{
					id: (a as OfferItemsFormGroup).controls['id'].value,
					serial: (a as OfferItemsFormGroup).controls['serial'].value,
					typeCode: ((a as OfferItemsFormGroup).controls['type'].value as NameCodePair)
						.code,
					weight: (a as OfferItemsFormGroup).controls['weight'].value,
					volume: (a as OfferItemsFormGroup).controls['volume'].value,
					naturalia: (a as OfferItemsFormGroup).controls['naturalia'].value,
					productType: (a as OfferItemsFormGroup).controls['productType'].value,
					value: this.currencyToNumber((a as OfferItemsFormGroup).controls['value'].value),
					currencyCode: ((a as OfferItemsFormGroup).controls['currency']
						.value as NameCodePair)
						? ((a as OfferItemsFormGroup).controls['currency'].value as NameCodePair)
								.code
						: undefined,
					comment: (a as OfferItemsFormGroup).controls['comment'].value,
					upDate: momentToServerDateString(
						(a as OfferItemsFormGroup).controls['upDate'].value
					) as string,
					upCode: (a as OfferItemsFormGroup).controls['upCode'].value,
					upCompany: (a as OfferItemsFormGroup).controls['upCompany'].value,
					upZipCode: this.cityInfoToZipCode((a as OfferItemsFormGroup).controls[
						'upZipCode'
					].value as CityInfo),
					upCityCode: this.cityInfoToCityId((a as OfferItemsFormGroup).controls[
						'upZipCode'
					].value as CityInfo),
					upAddress: (a as OfferItemsFormGroup).controls['upAddress'].value,
					upComment: (a as OfferItemsFormGroup).controls['upComment'].value,
					downDate: momentToServerDateString(
						(a as OfferItemsFormGroup).controls['downDate'].value
					) as string,
					downCode: (a as OfferItemsFormGroup).controls['downCode'].value,
					downCompany: (a as OfferItemsFormGroup).controls['downCompany'].value,
					downZipCode: this.cityInfoToZipCode((a as OfferItemsFormGroup).controls[
						'downZipCode'
					].value as CityInfo),
					downCityCode: this.cityInfoToCityId((a as OfferItemsFormGroup).controls[
						'downZipCode'
					].value as CityInfo),
					downAddress: (a as OfferItemsFormGroup).controls['downAddress'].value,
					downComment: (a as OfferItemsFormGroup).controls['downComment'].value
				}
		);
	}

	public applySource(source: OfferItemData[]): void {
		const items = source.map(a => this.createItemGroup(a));
		this.setControlValue(items);
	}

	public addNewItem(): void {
		const newItemGroup = new OfferItemsFormGroup(
			this.fb.group({
				id: new FormControl(),
				serial: new FormControl(''),
				type: new FormControl(this.offerTypes[0], [Validators.required]),
				weight: new FormControl(''),
				volume: new FormControl(''),
				naturalia: new FormControl(''),
				productType: new FormControl(''),
				value: new FormControl(''),
				currency: new FormControl(this.paymentCurrencies[0], [Validators.required]),
				comment: new FormControl(''),
				upDate: new FormControl(''),
				upCode: new FormControl(''),
				upCompany: new FormControl(''),
				upZipCode: new FormControl(''),
				upCityCode: new FormControl(''),
				upAddress: new FormControl(''),
				upComment: new FormControl(''),
				downDate: new FormControl(''),
				downCode: new FormControl(''),
				downCompany: new FormControl(''),
				downZipCode: new FormControl(''),
				downCityCode: new FormControl(''),
				downAddress: new FormControl(''),
				downComment: new FormControl('')
			})
		);

		this.extendWithCityAutocomplete(newItemGroup);
		const controls: OfferItemsFormGroup[] = [newItemGroup, ...this.getItemGroups()];
		this.setControlValue(controls);
		markControlsAsTouched(this.array);
	}

	public getItemGroups(): OfferItemsFormGroup[] {
		return this.array.controls.map(a => a as OfferItemsFormGroup);
	}

	public deleteItem(item: OfferItemsFormGroup): void {
		const controls = <OfferItemsFormGroup[]>this.array.controls.filter(a => a !== item);
		this.setControlValue(controls);
		if (item.controls['id'].value > 0) this.deleted.push(item.controls['id'].value);
	}

	public markAsTouched(): void {
		markControlsAsTouched(this.group);
	}

	public changeEnabled(enabled: boolean): void {
		changeEnabledOfControls(this.group, enabled);
	}

	private setControlValue(controls: OfferItemsFormGroup[]): void {
		this.array = this.fb.array(controls);
		this.group.setControl('items', this.array);
		this.array.updateValueAndValidity();
	}

	private currencyToNumber(value: any): number {
		if (isNaN(value)) {
			return parseFloat(value.replace(/[^\d\,]/g, () => '').replace(',', () => '.'));
		} else return value;
	}

	private cityInfoToZipCode(city: CityInfo): string {
		return city ? city.zipCode : '';
	}

	private cityInfoToCityId(city: CityInfo): number | null {
		return city ? city.id : null;
	}

	private dataToUpCityInfo(data: OfferItemData): CityInfo | null {
		return data.upZipCode
			? {
					id: data.upCityCode,
					city: data.upCity,
					zipCode: data.upZipCode,
					country: data.upCode
			}
			: null;
	}

	private dataToDownCityInfo(data: OfferItemData): CityInfo | null {
		return data.downZipCode
			? {
					id: data.downCityCode,
					city: data.downCity,
					zipCode: data.downZipCode,
					country: data.downCode
			}
			: null;
	}

	private createItemGroup(data: OfferItemData): OfferItemsFormGroup {
		const group = new OfferItemsFormGroup(
			this.fb.group({
				id: new FormControl(data.id),
				serial: new FormControl(data.serial),
				type: new FormControl(this.offerTypes.find(a => a.code === data.typeCode), [
					Validators.required
				]),
				weight: new FormControl(data.weight),
				volume: new FormControl(data.volume),
				naturalia: new FormControl(data.naturalia),
				productType: new FormControl(data.productType),
				value: new FormControl(data.value),
				currency: new FormControl(
					this.paymentCurrencies.find(a => a.code === data.currencyCode)
				),
				comment: new FormControl(data.comment),
				upDate: new FormControl(data.upDate),
				upCode: new FormControl(data.upCode),
				upCompany: new FormControl(data.upCompany),
				upZipCode: new FormControl(this.dataToUpCityInfo(data)),
				upCityCode: new FormControl(data.upCity),
				upAddress: new FormControl(data.upAddress),
				upComment: new FormControl(data.upComment),
				downDate: new FormControl(data.downDate),
				downCode: new FormControl(data.downCode),
				downCompany: new FormControl(data.downCompany),
				downZipCode: new FormControl(this.dataToDownCityInfo(data)),
				downCityCode: new FormControl(data.downCity),
				downAddress: new FormControl(data.downAddress),
				downComment: new FormControl(data.downComment)
			})
		);
		this.extendWithCityAutocomplete(group);
		return group;
	}

	private extendWithCityAutocomplete(itemsGroup: OfferItemsFormGroup): void {
		itemsGroup.upCities$ = itemsGroup.controls['upZipCode'].valueChanges.pipe(
			this.autoComplete
		);

		itemsGroup.downCities$ = itemsGroup.controls['downZipCode'].valueChanges.pipe(
			this.autoComplete
		);
	}

	private autoComplete = (observable: Observable<string>): Observable<any> =>
		observable.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			switchMap<string, CityInfo[]>(value => {
				if (value && value.length > 2)
					return this.oncityChanged(value).pipe(
						tap(options => {
							options.forEach(opt => (opt.id = opt.id));
						}),
						map((options: CityInfo[]) =>
							options.sort((a, b) =>
								a.city.toLowerCase().localeCompare(b.city.toLocaleLowerCase())
							)
						),
						catchError(() => of([]))
					);
				else return of([]);
			})
		)
}
