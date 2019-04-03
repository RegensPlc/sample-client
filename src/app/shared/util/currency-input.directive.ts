import {
	Directive,
	ElementRef,
	HostListener,
	OnInit,
	Input
	} from '@angular/core';
import { CurrencyLocalePipe } from './currency-locale.pipe';

@Directive({
	selector: '[ccdCurrencyInput]',
	providers: [CurrencyLocalePipe]
})
export class CurrencyInputDirective implements OnInit {
	private el: HTMLInputElement;
	@Input('ccdCurrencyInput') private digitsInfo: string | undefined;
	constructor(private elementRef: ElementRef, private currencyPipe: CurrencyLocalePipe) {
		this.el = this.elementRef.nativeElement;
	}

	ngOnInit() {
		this.el.value = this.currencyPipe.transform(this.el.value, false, this.digitsInfo) || '';
	}

	@HostListener('blur', ['$event.target.value'])
	onBlur(value: string) {
		this.el.value =
			this.currencyPipe.transform(value.replace(/[^\d\,]/g, '').replace(',', '.'), false, this.digitsInfo) || '';
	}
}
