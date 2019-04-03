import { HttpService } from './../../../shared/http/http.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from './../../../shared/user/user';

@Injectable()
export class UserMenuService {
	constructor(private readonly httpService: HttpService, private readonly user: User) {}

	public logout(): Observable<void> {
		return this.httpService
			.post<void>('account/logout')
			.pipe(tap(() => this.user.setFromAccountInfo(null)));
	}
}
