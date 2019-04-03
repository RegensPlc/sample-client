import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators
	} from '@angular/forms';
import { FormModelBase, markControlsAsTouched } from '../shared/form/form-model-base';

export interface LoginFormSource {
	userName: string;
	password: string;
}

export class LoginFormModel extends FormModelBase<LoginFormSource> {
	public readonly group: FormGroup;

	public readonly userName: FormControl;
	public readonly password: FormControl;

	constructor(fb: FormBuilder) {
		super();
		this.group = fb.group({
			userName: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required])
		});

		this.userName = this.group.controls['userName'] as FormControl;
		this.password = this.group.controls['password'] as FormControl;
	}

	public markAsTouched(): void {
		markControlsAsTouched(this.group);
	}

	public getSource(): LoginFormSource {
		return {
			userName: this.userName.value,
			password: this.password.value
		};
	}

	public applySource(source: LoginFormSource): void {
		this.userName.setValue(source.userName);
		this.password.setValue(source.password);
	}
}
