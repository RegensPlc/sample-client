import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FeaturesRoutes, NavigationServiceForFeatures } from './navigation-features';
import { LoginRoutes, NavigationServiceForLogin } from './navigation-login';

@Injectable()
export class NavigationService {
	constructor(private readonly router: Router) {}

	public features(): FeaturesRoutes {
		return new NavigationServiceForFeatures().getRoutes();
	}

	public login(): LoginRoutes {
		return new NavigationServiceForLogin().getRoutes();
	}

	public toLoginWithCurrentUrl(): void {
		const url = (this.router.url === '/' ? location.pathname : this.router.url) || '/';
		const needReturnUrl = url !== '/' && url !== '/ccd' && url !== '/ccd/';
		this.router.navigateByUrl(
			`${this.login().loginUrl()}${needReturnUrl ? `?returnurl=${url}` : ''}`
		);
	}
}
