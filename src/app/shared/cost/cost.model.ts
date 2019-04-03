import {
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	Validators
	} from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
	catchError,
	debounceTime,
	distinctUntilChanged,
	map,
	switchMap,
	tap
	} from 'rxjs/operators';
import {
	CostTypeInfo,
	NameCodePair,
	NameIdPair,
	RegisteredCostData,
	WarehouseInfo
	} from '../../../typings-server/server-interfaces';
import { changeEnabledOfControls, FormModelBase, markControlsAsTouched } from '../form/form-model-base';
import { localDateToMoment, momentDate, momentToServerDateString } from '../util/date-formatter';
import { CostFormGroup } from './cost-form-group';

export class CostModel extends FormModelBase<RegisteredCostData[]> {
	public array: FormArray;
	public group: FormGroup;
	public types: CostTypeInfo[] = [];
	public warehouses: WarehouseInfo[] = [];
	public buildings: NameIdPair[] = [];
	public defaultFromDate: momentDate;
	public defaultToDate: momentDate;

	constructor(
		private fb: FormBuilder,
		private readonly onPartnerChanged: (value: string) => Observable<NameCodePair[]>,
		private readonly onDeviceChanges: (value: string) => Observable<NameIdPair[]>
	) {
		super();
		this.array = this.fb.array([]);
		this.group = fb.group({
			array: this.array
		});

		this.setControlValue([]);
	}

	public getSource(): RegisteredCostData[] {
		return this.array.controls.map(
			(a: any) =>
				<RegisteredCostData>{
					id: (a as CostFormGroup).getId(),
					fromDate: momentToServerDateString(
						(a as CostFormGroup).controls['fromDate'].value
					),
					toDate: momentToServerDateString((a as CostFormGroup).controls['toDate'].value),
					type: (a as CostFormGroup).controls['type'].value.id,
					name: (a as CostFormGroup).controls['name'].value,
					value: this.currencyToNumber((a as CostFormGroup).controls['value'].value),
					warehouseCode: (a as CostFormGroup).controls['warehouseCode'].value
						? (a as CostFormGroup).controls['warehouseCode'].value.id
						: null,
					buildingId: (a as CostFormGroup).controls['buildingId'].value
						? (a as CostFormGroup).controls['buildingId'].value.id
						: null,
					baseHours: (a as CostFormGroup).controls['baseHours'].value,
					clientId: (a as CostFormGroup).controls['client'].value.code,
					clientName: (a as CostFormGroup).controls['client'].value.displayName,
					deviceId: (a as CostFormGroup).controls['device'].value.id,
					deviceName: (a as CostFormGroup).controls['device'].value.displayName
				}
		);
	}

	public applySource(source: RegisteredCostData[]): void {
		const costs = source.map(a => this.createCostGroup(a));
		this.setControlValue(costs);
	}

	public addNewCost(): void {
		const newCostGroup = new CostFormGroup(
			this.fb.group({
				id: new FormControl(''),
				fromDate: new FormControl(this.defaultFromDate, [Validators.required]),
				toDate: new FormControl(this.defaultToDate, [Validators.required]),
				type: new FormControl('', [Validators.required]),
				name: new FormControl('', []),
				value: new FormControl('', [Validators.required]),
				warehouseCode: new FormControl('', []),
				buildingId: new FormControl('', []),
				baseHours: new FormControl('', []),
				client: new FormControl('', []),
				device: new FormControl('', [])
			})
		);
		this.extendWithPartnerAutocomplete(newCostGroup);
		this.extendWithDeviceAutocomplete(newCostGroup);

		this.setControlValue([newCostGroup, ...this.getCostGroups()]);
	}

	public deleteCost(cost: CostFormGroup): void {
		const controls = <CostFormGroup[]>this.array.controls.filter(a => a !== cost);
		this.setControlValue(controls);
	}

	public getCostGroups(): CostFormGroup[] {
		return this.array.controls.map(a => a as CostFormGroup);
	}

	public markAsTouched(): void {
		markControlsAsTouched(this.group);
	}

	public changeEnabled(enabled: boolean): void {
		changeEnabledOfControls(this.group, enabled);
	}

	private setControlValue(controls: CostFormGroup[]): void {
		this.array = this.fb.array(controls);
		this.group.setControl('costs', this.array);
		this.array.updateValueAndValidity();
	}

	private currencyToNumber(value: any): number {
		if (isNaN(value)) {
			return parseFloat(value.replace(/[^\d\,]/g, () => '').replace(',', () => '.'));
		} else return value;
	}

	private extendWithPartnerAutocomplete(costGroup: CostFormGroup): void {
		costGroup.partners$ = costGroup.controls['client'].valueChanges.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			switchMap<string, NameCodePair[]>(value => {
				if (value && value.length > 2)
					return this.onPartnerChanged(value).pipe(
						tap(options => {
							options.forEach(opt => (opt.displayName = opt.displayName.trim()));
						}),
						map((options: NameCodePair[]) =>
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
		);
	}

	private extendWithDeviceAutocomplete(costGroup: CostFormGroup): void {
		costGroup.devices$ = costGroup.controls['device'].valueChanges.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			switchMap<string, NameIdPair[]>(value => {
				if (value && value.length > 2)
					return this.onDeviceChanges(value).pipe(
						tap(options => {
							options.forEach(opt => (opt.displayName = opt.displayName.trim()));
						}),
						map((options: NameIdPair[]) =>
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
		);
	}

	private createCostGroup(data: RegisteredCostData): CostFormGroup {
		const type = this.types.find(s => s.id === data.type);
		const group = new CostFormGroup(
			this.fb.group({
				id: new FormControl(data.id),
				fromDate: new FormControl(localDateToMoment(data.fromDate), [Validators.required]),
				toDate: new FormControl(localDateToMoment(data.toDate), [Validators.required]),
				type: new FormControl({
					value: this.types.find(s => s.id === data.type),
					disabled: true
				}),
				name: new FormControl(data.name),
				value: new FormControl(data.value, [Validators.required]),
				warehouseCode: new FormControl(
					this.warehouses.find(s => s.id === data.warehouseCode)
				),
				buildingId: new FormControl(
					this.buildings.find(s => s.id === data.buildingId)
				),
				baseHours: new FormControl(data.baseHours),
				client: new FormControl({ code: data.clientId, displayName: data.clientName }),
				device: new FormControl({ id: data.deviceId, displayName: data.deviceName })
			})
		);

		if (type) {
			if (type.warehouseRequired) {
				group.controls['warehouseCode'].setValidators(Validators.required);
			}
			if (type.buildingRequired) {
				group.controls['buildingId'].setValidators(Validators.required);
			}
			if (type.baseHourRequired) {
				group.controls['baseHours'].setValidators(Validators.required);
			}
			if (type.clientRequired) {
				group.controls['client'].setValidators(Validators.required);
			}
			if (type.deviceRequired) {
				group.controls['device'].setValidators(Validators.required);
			}
			this.array.updateValueAndValidity();
		}

		this.extendWithPartnerAutocomplete(group);
		this.extendWithDeviceAutocomplete(group);
		return group;
	}
}
