import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
	MachineSearchRequest,
	NameCodePair,
	NameIdPair,
	PartnerSearchRequest
	} from '../../../typings-server/server-interfaces';
import { HttpService } from '../http/http.service';

@Injectable()
export class CostsService {
	constructor(private readonly httpService: HttpService) {}

	public searchPartners(searchTerm: string): Observable<NameCodePair[]> {
		const request: PartnerSearchRequest = {
			searchTerm
		};
		return this.httpService.post<NameCodePair[]>(`partners/fszam`, request);
	}

	public searchDevices(searchTerm: string): Observable<NameIdPair[]> {
		const request: MachineSearchRequest = {
			searchTerm
		};
		return this.httpService.post<NameIdPair[]>(`machines`, request);
	}
}
