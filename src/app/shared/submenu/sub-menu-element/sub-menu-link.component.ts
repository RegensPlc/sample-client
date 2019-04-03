import { Component, Input } from '@angular/core';

@Component({
	selector: 'ccd-sub-menu-element',
	template: ``
})
export class SubMenuElementComponent {
	@Input() text: String = '';
	@Input() url: String = '';
	@Input() disabled: Boolean = true;
	@Input() icon: String = '';
	@Input() iconTitle: String = '';
}
