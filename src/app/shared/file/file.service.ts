import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './../http/http.service';

@Injectable()
export class FileService {
	constructor(private readonly httpService: HttpService) {}

	public uploadFile(
		file: File,
		progressCallback: (progress: number) => void
	): Observable<string> {
		return this.httpService.uploadFile(`files/`, file, progressCallback);
	}
}
