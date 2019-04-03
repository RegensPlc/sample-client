import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../shared/http/http.service';

@Injectable()
export class LayoutService {
	constructor(private readonly httpService: HttpService) {
	}

	public ping(): Observable<void> {
		return this.httpService.get<void>('ping');
	}

}
