import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { AccountInfo } from '../../typings-server/server-interfaces';
import { HttpServiceOptions } from '../shared/http/http-service-options';
import { HttpService } from '../shared/http/http.service';
import { User } from './../shared/user/user';

@Injectable()
export class LoginService {
	constructor(
		private readonly httpService: HttpService,
		private readonly httpServiceOptions: HttpServiceOptions,
		private readonly http: HttpClient,
		private readonly user: User
	) {}

	public login(userName: string, password: string): Observable<User> {
		password = encodeURIComponent(password);
		const body = `username=${userName}&password=${password}`;
		return this.http
			.post(
				`${this.httpServiceOptions.serverApiUrlPrefix}account/login`,
				body,
				this.getOptions() as any
			)
			.pipe(
				mergeMap(_ => this.httpService.get<AccountInfo>('account/me')),
				tap(userInfo => this.user.setFromAccountInfo(userInfo)),
				map(() => this.user)
			);
	}

	private getOptions(): { headers: HttpHeaders; observe: string; responseType: string } {
		const headers = new HttpHeaders()
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/x-www-form-urlencoded');

		return {
			headers: headers,
			observe: 'response',
			responseType: 'text'
		};
	}
}
