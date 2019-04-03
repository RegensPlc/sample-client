import { Injectable } from '@angular/core';
import { AccountInfo, RoleType } from '../../../typings-server/server-interfaces';
import { UtilService } from './../util/util.service';

@Injectable()
export class User {
	constructor(private readonly utilService: UtilService) {}

	public get isLoggedIn(): boolean {
		return !this.utilService.isEmpty(this.displayName);
	}
	public displayName: string = '';
	public userName: string = '';
	public roles: RoleType[] = [];

	public setFromAccountInfo(accountInfo: AccountInfo | null): void {
		if (accountInfo) {
			this.displayName = accountInfo.displayName;
			this.userName = accountInfo.username;
			this.roles = accountInfo.roles;
		} else {
			this.displayName = '';
			this.userName = '';
			this.roles = [];
		}
	}

	public hasRole(role: RoleType): boolean {
		return this.roles.includes(role);
	}

	public hasReadRole(): boolean {
		return (
			this.roles.includes(RoleType.ROLE_OFFER_READ) ||
			this.roles.includes(RoleType.ROLE_OPERATION_READ) ||
			this.roles.includes(RoleType.ROLE_COST_READ)
		);
	}
}
