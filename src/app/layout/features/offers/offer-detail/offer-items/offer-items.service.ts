import { Injectable } from '@angular/core';
import { OfferItemData, OfferItemsRequest, CityInfo, CitySearchRequest } from '../../../../../../typings-server/server-interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../../shared/http/http.service';

@Injectable()
export class OfferItemsService {
	constructor(private readonly httpService: HttpService) {}

	public getOfferItems(offerId: number): Observable<OfferItemData[]> {
		return this.httpService.get<OfferItemData[]>(`offers/${offerId}/items`);
	}

	public searchCities(searchTerm: string): Observable<CityInfo[]> {
		const request: CitySearchRequest = {
			searchTerm
		};
		return this.httpService.post<CityInfo[]>(`cities`, request);
	}

	public saveOfferItems(offerId: number, request: OfferItemsRequest) {
		return this.httpService.put<void>(`offers/${offerId}/items/save`, request);
	}

	public duplicateOfferItem(offerId: number, itemId: number): Observable<void> {
		return this.httpService.post<void>(`offers/${offerId}/items/${itemId}/duplicate`);
	}
}
