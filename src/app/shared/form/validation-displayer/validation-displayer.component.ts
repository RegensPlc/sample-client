import { Component, Input } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';

@Component({
	selector: 'ccd-validation-displayer',
	templateUrl: './validation-displayer.component.html',
	styleUrls: ['./validation-displayer.component.scss']
})
export class ValidationDisplayerComponent {
	@Input() public control: FormControl | null = null;
	@Input() public form: NgForm | null = null;
}
