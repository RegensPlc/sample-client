import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerInfo } from './../../../../typings-server/server-interfaces.d';
import { HttpService } from './../../../shared/http/http.service';

@Injectable()
export class MenuService {
	constructor(private readonly httpService: HttpService) {}

	public getServerInfo(): Observable<ServerInfo> {
		return this.httpService.get<ServerInfo>(`server/info`);
	}
}
