import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormModelBase } from '../../../../shared/form/form-model-base';
import { ValidatorsEx } from '../../../../shared/form/validators';
import { localDateToMoment, momentDate } from '../../../../shared/util/date-formatter';

export interface OfferSearchFormSource {
	year: number;
	serial: number;
	partnerName: string;
	dateFrom: momentDate;
	dateTo: momentDate;
	type: string;
	status: string;
	result: string;
}

export class OfferSearchModel extends FormModelBase<OfferSearchFormSource> {
	public readonly group: FormGroup;

	public readonly year: FormControl;
	public readonly serial: FormControl;
	public readonly partnerName: FormControl;
	public readonly dateFrom: FormControl;
	public readonly dateTo: FormControl;
	public readonly type: FormControl;
	public readonly status: FormControl;
	public readonly result: FormControl;

	constructor(fb: FormBuilder) {
		super();
		this.group = fb.group({
			year: new FormControl('', []),
			serial: new FormControl('', [ValidatorsEx.number]),
			partnerName: new FormControl('', []),
			dateFrom: new FormControl('', []),
			dateTo: new FormControl('', []),
			type: new FormControl('', []),
			status: new FormControl('', []),
			result: new FormControl('', [])
		});

		this.year = this.group.controls['year'] as FormControl;
		this.serial = this.group.controls['serial'] as FormControl;
		this.partnerName = this.group.controls['partnerName'] as FormControl;
		this.dateFrom = this.group.controls['dateFrom'] as FormControl;
		this.dateTo = this.group.controls['dateTo'] as FormControl;
		this.type = this.group.controls['type'] as FormControl;
		this.status = this.group.controls['status'] as FormControl;
		this.result = this.group.controls['result'] as FormControl;
	}

	public getSource(): OfferSearchFormSource {
		return {
			year: this.year.value,
			serial: this.serial.value,
			partnerName: this.partnerName.value,
			dateFrom: this.dateFrom.value,
			dateTo: this.dateTo.value,
			type: this.type.value ? this.type.value.code : null,
			status: this.status.value ? this.status.value.code : null,
			result: this.result.value ? this.result.value.code : null
		};
	}

	public applySource(source: OfferSearchFormSource): void {
		if (source !== undefined) {
			this.year.setValue(source.year);
			this.serial.setValue(source.serial);
			this.partnerName.setValue(source.partnerName);
			this.dateFrom.setValue(localDateToMoment(source.dateFrom));
			this.dateTo.setValue(localDateToMoment(source.dateTo));
			this.type.setValue(source.type);
			this.status.setValue(source.status);
			this.result.setValue(source.result);
		}
	}
}

export class SearchFormStateService {
	public offerSearchFormState: OfferSearchFormSource = <OfferSearchFormSource>{};
	public setOfferSearchFormState(offerSearchFormState: OfferSearchFormSource): void {
		this.offerSearchFormState = offerSearchFormState;
	}
	public getOfferSearchFormState() {
		return this.offerSearchFormState;
	}
}
