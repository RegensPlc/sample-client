import { registerLocaleData } from '@angular/common';
import localeHU from '@angular/common/locales/hu';
import {
	APP_INITIALIZER,
	Injector,
	LOCALE_ID,
	ModuleWithProviders,
	NgModule,
	Provider
	} from '@angular/core';
import { MAT_DATE_FORMATS, MatPaginatorIntl } from '@angular/material';
import { AccountInfo } from '../../typings-server/server-interfaces';
import { FileService } from './file/file.service';
import { HttpServiceOptions } from './http/http-service-options';
import { HttpService } from './http/http.service';
import { LoadingBarService } from './loading-bar/loading-bar.serivce';
import { MatPaginatorIntlHu } from './material/mat-paginator-intl-hu';
import { NavigationService } from './navigation/navigation.service';
import { NotificationService } from './notification/notification.service';
import { User } from './user/user';
import { APP_MAT_DATE_FORMATS } from './util/date-formatter';
import { LocaleUtil } from './util/locale-util';
import { UtilService } from './util/util.service';
registerLocaleData(localeHU);

export function appInitFactory(injector: Injector): () => Promise<any> {
	return (): Promise<any> => {
		return new Promise((resolve, _reject) => {
			const httpService: HttpService = injector.get<HttpService>(HttpService);
			const user: User = injector.get<User>(User);

			httpService.get<AccountInfo | null>('account/me').subscribe(userInfo => {
				user.setFromAccountInfo(userInfo);
				resolve();
			});
		});
	};
}

export function httpServiceOptionsFactory(): HttpServiceOptions {
	const options = new HttpServiceOptions();
	options.serverApiUrlPrefix = 'api/';
	return options;
}

const locale = LocaleUtil.getLocale();

let providers: Provider[] = [
	{
		provide: APP_INITIALIZER,
		useFactory: appInitFactory,
		multi: true,
		deps: [Injector]
	},
	{
		provide: LOCALE_ID,
		useValue: locale
	},
	{
		provide: HttpServiceOptions,
		useFactory: httpServiceOptionsFactory
	},
	{
		// any locale can and should use the custom format, it is not Hungarian specific
		provide: MAT_DATE_FORMATS,
		useValue: APP_MAT_DATE_FORMATS
	},
	UtilService,
	NotificationService,
	NavigationService,
	User,
	HttpService,
	FileService,
	LoadingBarService
];

if (locale === 'hu') {
	providers = [
		...providers,
		{
			provide: MatPaginatorIntl,
			useClass: MatPaginatorIntlHu
		}
	];
}

@NgModule({})
export class CoreModule {
	public static forRoot(): ModuleWithProviders {
		return {
			ngModule: CoreModule,
			providers
		};
	}
}
