import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NameCodePair, NameIdPair } from '../../../../../../typings-server/server-interfaces';
import {
	changeEnabledOfControls,
	FormModelBase,
	markControlsAsTouched
} from '../../../../../shared/form/form-model-base';

export interface OfferDetailFormSource {
	partner?: NameIdPair;
	coworker?: string;
	partnerAdministrator?: NameIdPair;
	type?: NameCodePair;
	status?: NameCodePair;
	result?: NameCodePair;
	resultComment?: string;
	paymentMethod?: NameCodePair;
	paymentCurrency?: NameCodePair;
	paymentDays?: number;
	comment?: string;
	date?: moment.Moment;
	startOfValidity?: moment.Moment;
	endOfValidity?: moment.Moment;
	parityCode?: string;
	parityComment?: string;
	languageCode: string;
}

export class OfferDetailModel extends FormModelBase<OfferDetailFormSource> {
	public readonly group: FormGroup;

	partner: FormControl;
	coworker: FormControl;
	partnerAdministrator: FormControl;
	type: FormControl;
	status: FormControl;
	result: FormControl;
	resultComment: FormControl;
	paymentMethod: FormControl;
	paymentCurrency: FormControl;
	paymentDays: FormControl;
	comment: FormControl;
	date: FormControl;
	startOfValidity: FormControl;
	endOfValidity: FormControl;
	parityCode: FormControl;
	parityComment: FormControl;
	languageCode: FormControl;

	constructor(fb: FormBuilder) {
		super();

		this.partner = new FormControl('', [Validators.required]);
		this.coworker = new FormControl('', [Validators.required]);
		this.partnerAdministrator = new FormControl('');
		this.type = new FormControl('', [Validators.required]);
		this.status = new FormControl('', [Validators.required]);
		this.result = new FormControl('', [Validators.required]);
		this.resultComment = new FormControl('');
		this.paymentMethod = new FormControl('', [Validators.required]);
		this.paymentCurrency = new FormControl('', [Validators.required]);
		this.paymentDays = new FormControl([], [Validators.required]);
		this.comment = new FormControl([]);
		this.date = new FormControl(moment(), [Validators.required]);
		this.startOfValidity = new FormControl([], [Validators.required]);
		this.endOfValidity = new FormControl([]);
		this.parityCode = new FormControl([]);
		this.parityComment = new FormControl([]);
		this.languageCode = new FormControl('', [Validators.required]);

		this.group = fb.group({
			partner: this.partner,
			coworker: this.coworker,
			partnerAdministrator: this.partnerAdministrator,
			type: this.type,
			status: this.status,
			result: this.result,
			resultComment: this.resultComment,
			paymentMethod: this.paymentMethod,
			paymentCurrency: this.paymentCurrency,
			paymentDays: this.paymentDays,
			comment: this.comment,
			date: this.date,
			startOfValidity: this.startOfValidity,
			endOfValidity: this.endOfValidity,
			parityCode: this.parityCode,
			parityComment: this.parityComment,
			languageCode: this.languageCode
		});
	}

	public markAsTouched(): void {
		markControlsAsTouched(this.group);
	}

	public changeEnabled(enabled: boolean): void {
		changeEnabledOfControls(this.group, enabled);
	}

	public createEmptySource(overrides?: Partial<OfferDetailFormSource>): OfferDetailFormSource {
		return {
			partner: <any>undefined,
			coworker: <any>undefined,
			partnerAdministrator: <any>undefined,
			type: <any>undefined,
			status: <any>undefined,
			result: <any>undefined,
			resultComment: <any>undefined,
			paymentMethod: <any>undefined,
			paymentCurrency: <any>undefined,
			paymentDays: <any>undefined,
			comment: <any>undefined,
			date: moment(),
			startOfValidity: moment(),
			endOfValidity: moment().add('months', 1),
			parityCode: <any>undefined,
			parityComment: <any>undefined,
			languageCode: <any>undefined,
			...(overrides || {})
		};
	}

	public applySource(source: OfferDetailFormSource): void {
		this.partner.setValue(source.partner);
		this.coworker.setValue(source.coworker);
		this.partnerAdministrator.setValue(source.partnerAdministrator);
		this.type.setValue(source.type);
		this.status.setValue(source.status);
		this.result.setValue(source.result);
		this.resultComment.setValue(source.resultComment);
		this.paymentMethod.setValue(source.paymentMethod);
		this.paymentCurrency.setValue(source.paymentCurrency);
		this.paymentDays.setValue(source.paymentDays);
		this.comment.setValue(source.comment);
		this.date.setValue(source.date);
		this.startOfValidity.setValue(source.startOfValidity);
		this.endOfValidity.setValue(source.endOfValidity);
		this.parityCode.setValue(source.parityCode);
		this.parityComment.setValue(source.parityComment);
		this.languageCode.setValue(source.languageCode);

		this.group.markAsPristine();
	}
	public getSource(): OfferDetailFormSource {
		return {
			partner: this.partner.value,
			coworker: this.coworker.value,
			partnerAdministrator: this.partnerAdministrator.value,
			type: this.type.value,
			status: this.status.value,
			result: this.result.value,
			resultComment: this.resultComment.value,
			paymentMethod: this.paymentMethod.value,
			paymentCurrency: this.paymentCurrency.value,
			paymentDays: this.paymentDays.value,
			comment: this.comment.value,
			date: this.date.value,
			startOfValidity: this.startOfValidity.value,
			endOfValidity: this.endOfValidity.value,
			parityCode: this.parityCode.value,
			parityComment: this.parityComment.value,
			languageCode: this.languageCode.value
		};
	}
}
