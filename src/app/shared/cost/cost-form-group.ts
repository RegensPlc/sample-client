import {
	AbstractControlOptions,
	AsyncValidatorFn,
	FormGroup,
	ValidatorFn
	} from '@angular/forms';
import { Observable } from 'rxjs';
import { NameCodePair, NameIdPair } from '../../../typings-server/server-interfaces';

export class CostFormGroup extends FormGroup {
	public partners$: Observable<NameCodePair[]> = <Observable<NameCodePair[]>>{};
	public devices$: Observable<NameIdPair[]> = <Observable<NameIdPair[]>>{};

	constructor(
		group: FormGroup,
		validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
		asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
	) {
		super(group.controls, validatorOrOpts, asyncValidator);
	}

	public getId(): number | undefined {
		return this.controls['id'].value;
	}
}
