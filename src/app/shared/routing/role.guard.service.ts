import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { RoleType } from '../../../typings-server/server-interfaces';
import { User } from '../user/user';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(public user: User, public router: Router) {}

	public canActivate(route: ActivatedRouteSnapshot): boolean {
		if (!route.data.roles) return true;

		let hasAllRoles = true;
		(<RoleType[]>route.data.roles).forEach(
			role => (hasAllRoles = hasAllRoles && this.user.hasRole(role))
		);

		return hasAllRoles;
	}
}
