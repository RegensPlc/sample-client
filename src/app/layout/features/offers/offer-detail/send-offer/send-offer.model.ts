import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators
	} from '@angular/forms';
import { FormModelBase, markControlsAsTouched } from '../../../../../shared/form/form-model-base';
export interface SendOfferFormSource {
	recipients: string;
	message: string;
}

export class SendOfferModel extends FormModelBase<SendOfferFormSource> {
	public readonly group: FormGroup;

	recipients: FormControl;
	message: FormControl;

	constructor(fb: FormBuilder) {
		super();

		this.recipients = new FormControl('', [Validators.required]);
		this.message = new FormControl('', [Validators.required]);

		this.group = fb.group({
			recipients: this.recipients,
			message: this.message
		});
	}

	public markAsTouched(): void {
		markControlsAsTouched(this.group);
	}

	public applySource(source: SendOfferFormSource): void {
		this.recipients.setValue(source.recipients);
		this.message.setValue(source.message);
		this.group.markAsPristine();
	}
	public getSource(): SendOfferFormSource {
		return {
			recipients: this.recipients.value,
			message: this.message.value
		};
	}
}
