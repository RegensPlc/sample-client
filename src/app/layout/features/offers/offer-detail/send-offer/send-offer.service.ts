import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PartnerAdministratorEmailInfo, SendOfferData } from '../../../../../../typings-server/server-interfaces';
import { HttpService } from './../../../../../shared/http/http.service';

@Injectable()
export class SendOfferService {
	constructor(private readonly httpService: HttpService) {}

	public sendOffer(id: number, sendOfferData: SendOfferData): Observable<void> {
		return this.httpService.post(`offers/${id}/send`, sendOfferData);
	}

	public getPartnerEmail(partnerId: number): Observable<PartnerAdministratorEmailInfo> {
		return this.httpService.get(`partneradministrators/${partnerId}/email`);
	}
}
