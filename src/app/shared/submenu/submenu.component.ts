import { Component, ContentChildren, QueryList } from '@angular/core';
import { SubMenuElementComponent } from './sub-menu-element/sub-menu-link.component';

@Component({
	selector: 'ccd-submenu',
	styleUrls: ['./submenu.component.scss'],
	templateUrl: './submenu.component.html'
})
export class SubmenuComponent {
	@ContentChildren(SubMenuElementComponent)
	items: QueryList<SubMenuElementComponent> = <QueryList<SubMenuElementComponent>>{};
}
