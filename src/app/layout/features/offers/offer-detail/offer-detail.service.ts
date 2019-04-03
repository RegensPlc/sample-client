import { Injectable } from '@angular/core';
import { HttpService } from '../../../../shared/http/http.service';
import { NameCodePair } from '../../../../../typings-server/server-interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class OfferDetailService {
	constructor(private readonly httpService: HttpService) {}

	public getOfferTypes(): Observable<NameCodePair[]> {
		return this.httpService.get<NameCodePair[]>(`offertypes`);
	}

	public getPaymentCurrencies(): Observable<NameCodePair[]> {
		return this.httpService.get<NameCodePair[]>(`currencies`);
	}
}
