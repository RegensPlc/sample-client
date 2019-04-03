import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
	DateAsString,
	NameCodePair,
	OfferListResponse,
	OfferSearchRequest,
	OfferSummary
	} from '../../../../../typings-server/server-interfaces';
import { HttpService } from '../../../../shared/http/http.service';
import { formatDateToLocal, momentToServerDateString } from '../../../../shared/util/date-formatter';
import { OfferSearchFormSource } from './offer-list.model';

@Injectable()
export class OfferListService {
	constructor(private readonly httpService: HttpService) {}

	public getOffers(
		filter: OfferSearchFormSource,
		page: number,
		pageSize: number,
		sortField: string,
		sortDirection: string
	): Observable<{ items: OfferSummary[]; count: number }> {
		return this.httpService
			.post<OfferListResponse>(
				'offers',
				this.createServerFilter(filter, page, pageSize, sortField, sortDirection)
			)
			.pipe(
				map(a => ({
					items: (a.data || []).map(
						b =>
							<OfferSummary>{
								id: <number>b.id,
								offerId: <string>b.offerId,
								year: <number>b.year,
								serial: <number>b.serial,
								partnerName: <string>b.partnerName,
								date: formatDateToLocal(<DateAsString>b.date),
								endOfValidity: formatDateToLocal(<DateAsString>b.endOfValidity),
								typeId: <string>b.typeId,
								typeName: <string>b.typeName,
								statusId: <string>b.statusId,
								statusName: <string>b.statusName,
								resultId: <string>b.resultId,
								resultName: <string>b.resultName
							}
					),
					count: a.totalCount || 0
				}))
			);
	}

	private createServerFilter(
		filter: OfferSearchFormSource,
		page: number,
		pageSize: number,
		sortField: string,
		sortDirection: string
	): Partial<OfferSearchRequest> {
		return {
			page,
			pageSize,
			sortField,
			asc: sortDirection ? (sortDirection === 'asc' ? true : false) : undefined,
			year: filter.year || undefined,
			serial: filter.serial || undefined,
			partnerName: filter.partnerName || undefined,
			dateFrom: momentToServerDateString(filter.dateFrom) || undefined,
			dateTo: momentToServerDateString(filter.dateTo) || undefined,
			type: filter.type || undefined,
			status: filter.status || undefined,
			result: filter.result || undefined
		};
	}

	public getOfferTypes(): Observable<NameCodePair[]> {
		return this.httpService.get<NameCodePair[]>(`offertypes`);
	}

	public getOfferStates(): Observable<NameCodePair[]> {
		return this.httpService.get<NameCodePair[]>(`offerstates`);
	}

	public getOfferResults(): Observable<NameCodePair[]> {
		return this.httpService.get<NameCodePair[]>(`offerresults`);
	}
}
