import { Injectable } from '@angular/core';

@Injectable()
export class HttpServiceOptions {
	public serverApiUrlPrefix = '';
	public maxUploadFileSize = 0;
}
