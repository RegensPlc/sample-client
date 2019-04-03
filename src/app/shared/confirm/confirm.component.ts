import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

export interface ConfirmData {
	title: string;
	message: string;
}

@Component({
	selector: 'ccd-confirm',
	templateUrl: './confirm.component.html',
	styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent {
	constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmData) {}
}
