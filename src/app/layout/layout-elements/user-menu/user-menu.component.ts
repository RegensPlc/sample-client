import { Component } from '@angular/core';
import { NavigationService } from './../../../shared/navigation/navigation.service';
import { Router } from '@angular/router';
import { UserMenuService } from './user-menu.service';
import { User } from '../../../shared/user/user';

@Component({
	selector: 'ccd-user-menu',
	templateUrl: './user-menu.component.html',
	styleUrls: ['./user-menu.component.scss'],
	providers: [UserMenuService]
})
export class UserMenuComponent {
	constructor(
		private readonly router: Router,
		private readonly service: UserMenuService,
		private readonly navigationService: NavigationService,
		public readonly user: User
	) {}

	public onLogout(): void {
		this.service
			.logout()
			.subscribe(() => this.router.navigateByUrl(this.navigationService.login().loginUrl()));
	}
}
