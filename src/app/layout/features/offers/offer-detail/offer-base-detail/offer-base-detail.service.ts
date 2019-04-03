import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
	CoworkerInfo,
	NameCodePair,
	NameIdPair,
	OfferData,
	OfferDetailInfo,
	PartnerAdministratorInfo,
	PartnerSearchRequest
} from '../../../../../../typings-server/server-interfaces';
import { HttpService } from '../../../../../shared/http/http.service';

@Injectable()
export class OfferBaseDetailService {
	constructor(private readonly httpService: HttpService) {}

	public getDetail(offerId: number): Observable<OfferDetailInfo> {
		return this.httpService.get<OfferDetailInfo>(`offers/${offerId}`);
	}

	public duplicateOffer(offerId: number, withItems: Boolean): Observable<string> {
		return this.httpService.post<string>(`offers/${offerId}/duplicate`, withItems);
	}

	public stornoOffer(offerId: number): Observable<void> {
		return this.httpService.post<void>(`offers/${offerId}/storno`);
	}

	public updateOffer(operationId: number, operationData: OfferData): Observable<void> {
		return this.httpService.put<void>(`offers/${operationId}`, operationData);
	}

	public createOffer(operationData: OfferData): Observable<number> {
		return this.httpService.post<number>(`offers/new`, operationData);
	}

	public getCoworkers(): Observable<CoworkerInfo[]> {
		return this.httpService.get<CoworkerInfo[]>(`coworkers`);
	}

	public searchPartners(searchTerm: string): Observable<NameIdPair[]> {
		const request: PartnerSearchRequest = {
			searchTerm
		};
		return this.httpService.post<NameIdPair[]>(`partners`, request);
	}

	public getPartnerAdministrators(): Observable<PartnerAdministratorInfo[]> {
		return this.httpService.get<PartnerAdministratorInfo[]>(`partneradministrators`);
	}

	public getOfferStates(): Observable<NameCodePair[]> {
		return this.httpService.get<NameCodePair[]>(`offerstates`);
	}

	public getOfferResults(): Observable<NameCodePair[]> {
		return this.httpService.get<NameCodePair[]>(`offerresults`);
	}

	public getPaymentTypes(): Observable<NameCodePair[]> {
		return this.httpService.get<NameCodePair[]>(`paymenttypes`);
	}

	public getOfferLanguages(): Observable<NameCodePair[]> {
		return this.httpService.get<NameCodePair[]>(`offerlanguages`);
	}

	public downloadPdfPreview(url: string): Observable<void> {
		return this.httpService.downloadFile(url) as Observable<void>;
	}
}
