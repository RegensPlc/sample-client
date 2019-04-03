import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ComponentBase } from './shared/component/component-base';
import { HttpService } from './shared/http/http.service';
import { NavigationService } from './shared/navigation/navigation.service';
import { User } from './shared/user/user';
import { LocaleUtil } from './shared/util/locale-util';

@Component({
	selector: 'ccd-app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent extends ComponentBase implements OnInit {
	constructor(
		private readonly translateService: TranslateService,
		private readonly httpService: HttpService,
		private readonly user: User,
		private readonly navigationService: NavigationService
	) {
		super();
	}

	public ngOnInit(): void {
		// this language will be used as a fallback when a translation isn't found in the current language
		this.translateService.setDefaultLang('hu');
		// the lang to use, if the lang isn't available, it will use the current loader to get them
		this.translateService.use(LocaleUtil.getLocale());

		this.addManagedSubscription(
			this.httpService.responseEvent.subscribe(res => {
				if (res.status === 401) {
					// make sure that the user is considered logged out as well
					this.user.setFromAccountInfo(null);
					this.navigationService.toLoginWithCurrentUrl();
				}
			})
		);
	}
}
