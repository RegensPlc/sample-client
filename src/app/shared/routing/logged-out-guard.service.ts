import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot
	} from '@angular/router';
import { Observable } from 'rxjs';
import { NavigationService } from '../navigation/navigation.service';
import { User } from './../user/user';

@Injectable()
export class LoggedOutGuardService implements CanActivate {
	constructor(
		private readonly router: Router,
		private readonly user: User,
		private readonly navigationService: NavigationService
	) {}

	public canActivate(
		_route: ActivatedRouteSnapshot,
		_state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		if (!this.user.isLoggedIn) return true;

		this.router.navigateByUrl(
			this.navigationService
				.features()
				.operations()
				.getOperationListUrl()
		);
		return false;
	}
}
