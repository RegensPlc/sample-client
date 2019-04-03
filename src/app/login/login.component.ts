import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RoleType } from '../../typings-server/server-interfaces';
import { NavigationService } from './../shared/navigation/navigation.service';
import { NotificationService } from './../shared/notification/notification.service';
import { LoginFormModel } from './login.model';
import { LoginService } from './login.service';

@Component({
	selector: 'ccd-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	providers: [LoginService]
})
export class LoginComponent {
	public formModel: LoginFormModel;

	constructor(
		fb: FormBuilder,
		private readonly router: Router,
		private readonly route: ActivatedRoute,
		private readonly loginService: LoginService,
		private readonly navigationService: NavigationService,
		private readonly notificationService: NotificationService,
		private readonly translateService: TranslateService
	) {
		this.formModel = new LoginFormModel(fb);
	}

	public onLogin(): void {
		this.formModel.markAsTouched();
		if (!this.formModel.group.valid) return;

		const source = this.formModel.getSource();
		this.loginService.login(source.userName, source.password).subscribe(
			user => {
				if (user.hasReadRole() === false) {
					this.notificationService.showError(
						this.translateService.instant('Login.No_user_roles')
					);
				} else {
					const url = this.route.snapshot.queryParams['returnurl'];
					if (url) {
						this.router.navigateByUrl(url);
						return;
					}
					if (user.hasRole(RoleType.ROLE_OFFER_READ)) {
						this.router.navigateByUrl(
							this.navigationService
								.features()
								.offers()
								.getOfferListUrl()
						);
					} else if (user.hasRole(RoleType.ROLE_OPERATION_READ)) {
						this.router.navigateByUrl(
							this.navigationService
								.features()
								.operations()
								.getOperationListUrl()
						);
					} else if (user.hasRole(RoleType.ROLE_COST_READ)) {
						this.router.navigateByUrl(
							this.navigationService
								.features()
								.costs()
								.getCostDiaryUrl()
						);
					}
				}
			},
			(err: HttpErrorResponse) => {
				if (err.status === 401)
					this.notificationService.showError(
						this.translateService.instant('Login.Invalid_Username_Or_Password')
					);
				else this.notificationService.showError(err.error || err.message || err);
			}
		);
	}
}
