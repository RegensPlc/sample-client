import { AbstractControl, ValidationErrors } from '@angular/forms';

const DECIMAL_REGEXP = /^[+-]?(?=.)(?:\d+,)*\d*(?:\.\d+)?$/;

export class ValidatorsEx {
	static number(control: AbstractControl): ValidationErrors | null {
		if (!control.value) {
			return null; // don't validate empty values to allow optional controls
		}
		return DECIMAL_REGEXP.test(control.value) ? null : { number: true };
	}
}
