import { AbstractControlOptions, AsyncValidatorFn, FormGroup, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { CityInfo } from '../../../../../../typings-server/server-interfaces';

export class OfferItemsFormGroup extends FormGroup {
	public upCities$: Observable<CityInfo[]> = <Observable<CityInfo[]>>{};
	public downCities$: Observable<CityInfo[]> = <Observable<CityInfo[]>>{};

	constructor(
		group: FormGroup,
		validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
		asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
	) {
		super(group.controls, validatorOrOpts, asyncValidator);
	}
}
