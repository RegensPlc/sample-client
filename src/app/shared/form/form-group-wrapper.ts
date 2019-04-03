import { FormGroup } from '@angular/forms';

/**Necessary when using the FormGroup.controls property in html. Aot says there is no 'controls' property on the FormGroup class.*/
export class FormGroupWrapper {
	constructor(public group: FormGroup) {}

	get controls(): any {
		return this.group.controls;
	}
}
