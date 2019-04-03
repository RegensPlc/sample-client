const localeKey = 'locale';

export class LocaleUtil {
	static getLocale(): string {
		return localStorage.getItem(localeKey) || 'hu';
	}

	static setLocale(locale: string): void {
		localStorage.setItem(localeKey, locale);
	}
}
