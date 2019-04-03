import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

export abstract class FormModelBase<T> {
	public abstract applySource(source: T): void;
	public abstract getSource(): T;

	protected setAvailabilityOfControl(control: AbstractControl, enabled: boolean): void {
		if (enabled) control.enable();
		else control.disable();
		if (control instanceof FormGroup || control instanceof FormArray) {
			for (const contName in (<FormGroup>control).controls) {
				this.setAvailabilityOfControl((<FormGroup>control).controls[contName], enabled);
			}
		}
	}
}

export function markControlsAsTouched(control: AbstractControl): void {
	control.markAsTouched();
	if (control instanceof FormGroup || control instanceof FormArray) {
		for (const contName in (<FormGroup>control).controls) {
			markControlsAsTouched((<FormGroup>control).controls[contName]);
		}
	}
}

export function changeEnabledOfControls(control: AbstractControl, enabled: boolean): void {
	if (enabled) {
		control.enable();
	} else {
		control.disable();
	}
	if (control instanceof FormGroup || control instanceof FormArray) {
		for (const contName in (<FormGroup>control).controls) {
			const c = (<FormGroup>control).controls[contName];
			changeEnabledOfControls(c, enabled);
		}
	}
}
