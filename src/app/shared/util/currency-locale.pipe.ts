import { CurrencyPipe } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyLocale' })
export class CurrencyLocalePipe implements PipeTransform {
	constructor(@Inject(LOCALE_ID) private locale: string) {}
	transform(value: string, includeCurrencyCode: boolean = false, digitsInfo: string | undefined = '1.2-2'): string | null {
		const currencyPipe = new CurrencyPipe(this.locale);
		if (!value) return null;
		const result =
			currencyPipe.transform(
				value,
				'Ft',
				'symbol-narrow',
				digitsInfo,
				this.locale
			) || '';
		return includeCurrencyCode ? result : result.replace('Ft', '');
	}
}
