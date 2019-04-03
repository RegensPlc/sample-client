import { APP_BASE_HREF } from '@angular/common';
import {
	HttpClient,
	HttpErrorResponse,
	HttpEvent,
	HttpEventType,
	HttpHeaders,
	HttpRequest,
	HttpResponse,
	HttpResponseBase
	} from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
	Observable,
	of,
	Subject,
	throwError
	} from 'rxjs';
import {
	catchError,
	finalize,
	last,
	map,
	tap
	} from 'rxjs/operators';
import { NotificationService } from '../notification/notification.service';
import { LocaleUtil } from '../util/locale-util';
import { LoadingBarService } from './../loading-bar/loading-bar.serivce';
import { UtilService } from './../util/util.service';
import { HttpServiceOptions } from './http-service-options';
import { HttpSettings } from './http-settings';

export enum RequestType {
	Get,
	Post,
	Put,
	Delete
}

@Injectable()
export class HttpService {
	public get responseEvent(): Observable<HttpResponseBase> {
		return this.responseEventStream.asObservable();
	}
	private responseEventStream: Subject<HttpResponseBase>;

	constructor(
		@Optional()
		@Inject(APP_BASE_HREF)
		private baseUrl: string,
		private readonly translateService: TranslateService,
		private readonly httpClient: HttpClient,
		private readonly options: HttpServiceOptions,
		private readonly notificationService: NotificationService,
		private readonly utilService: UtilService,
		private readonly loadingBarService: LoadingBarService
	) {
		this.responseEventStream = new Subject();
	}

	public get<T>(url: string, settings?: HttpSettings): Observable<T> {
		settings = settings || {};
		return this.call(
			this.httpClient.get<HttpResponse<string>>(
				this.getUrl(url),
				this.createDefaultRequestOptions(settings)
			),
			RequestType.Get,
			settings
		);
	}

	public post<T>(url: string, data?: any, settings?: HttpSettings): Observable<T> {
		if (data === null) data = undefined;

		settings = settings || {};
		return this.call(
			this.httpClient.post<HttpResponse<string>>(
				this.getUrl(url),
				data,
				this.createDefaultRequestOptions(settings)
			),
			RequestType.Post,
			settings
		);
	}

	public put<T>(url: string, data: any, settings?: HttpSettings): Observable<T> {
		if (data === null) data = undefined;

		settings = settings || {};
		return this.call(
			this.httpClient.put<HttpResponse<string>>(
				this.getUrl(url),
				data,
				this.createDefaultRequestOptions(settings)
			),
			RequestType.Put,
			settings
		);
	}

	public delete(url: string, settings?: HttpSettings): Observable<void> {
		settings = settings || {};
		return this.call<void>(
			this.httpClient.delete<HttpResponse<string>>(
				this.getUrl(url),
				this.createDefaultRequestOptions(settings)
			),
			RequestType.Delete,
			settings
		);
	}

	public uploadFile(
		url: string,
		file: File,
		progressCallback?: (progress: number) => void
	): Observable<string> {
		url = this.getUrl(url);
		const sizeInKB = file.size / 1024;
		const maxSizeInKB = this.options.maxUploadFileSize / 1024;
		if (sizeInKB > maxSizeInKB) {
			return throwError(
				this.translateService.instant('FileUpload.TooBigFile', {
					size: Math.round(sizeInKB)
				})
			);
		}

		const formData = new FormData();
		formData.append('file', file);

		const request = new HttpRequest('POST', url, formData, {
			reportProgress: true,
			responseType: 'text'
		});

		return this.httpClient.request(request).pipe(
			tap((e: any) => {
				const event = <HttpEvent<any>>e;

				switch (event.type) {
					case HttpEventType.UploadProgress:
						// compute the % done:
						const percent = Math.round((100 * event.loaded) / (event.total as number));
						if (progressCallback) progressCallback(percent);
						break;
					// default:
					// 	console.log(event);
				}
			}),
			// return last (completed) message to caller
			last(),
			// the beauty of the last() operator: this "map" will execute only on the last item which is an HttpResponse (and Progress events are skipped, yaay!)
			map((resp: HttpResponse<any>) => resp.body),
			catchError(err => this.handleError(err, RequestType.Post))
		);
	}

	public downloadFile(url: string): Observable<void | HttpResponse<string>> {
		const headers = new HttpHeaders().set('Accept-Language', LocaleUtil.getLocale());

		const options = <any>{
			headers,
			observe: 'response',
			responseType: 'arraybuffer'
		};

		this.onRequestStarted();
		return this.httpClient.get<HttpResponse<string>>(this.getUrl(url), options).pipe(
			finalize(() => this.onRequestEnded()),
			tap((res: any) => {
				const response = res as HttpResponse<string>;
				// let contentType = res.headers.get('content-type') || 'application/octet-stream';
				const contentDisposition = response.headers.get('content-disposition');
				const blob = new Blob([response.body] as any);
				const fileName =
					this.utilService.parseFileNameFromDispositionHeader(contentDisposition || '') ||
					'';

				this.downloadFileFromClient(blob, fileName);
			}),
			catchError(err => this.handleError(err, RequestType.Get))
		);
	}

	public downloadFileFromClient(blob: Blob, fileName: string): void {
		if (navigator.msSaveOrOpenBlob) {
			navigator.msSaveOrOpenBlob(blob, fileName);
		} else {
			const link = document.createElement('a');
			link.href = (URL as any).createObjectURL(blob, { oneTimeOnly: true });
			link.setAttribute('download', fileName);

			// Firefox requires the link to be added to the DOM before it can be clicked.
			link.style.display = 'none';
			document.body.appendChild(link);
			// immediately remove the generated garbage after we click it programatically
			link.onclick = () => document.body.removeChild(link);

			link.click();
		}
	}

	// taken from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#Description
	public encodeURLParameter(param: string): string {
		return encodeURIComponent(param).replace(
			/[!'()*]/g,
			c => `%${c.charCodeAt(0).toString(16)}`
		);
	}

	public getUrl(url: string): string {
		return `${this.baseUrl || ''}${this.options.serverApiUrlPrefix}${url}`;
	}

	public showErrorFromResponse(response: HttpErrorResponse, requestType: RequestType): void {
		this.getErrorMessage(response, requestType).subscribe(errorMsg =>
			this.notificationService.showError(errorMsg)
		);
	}

	private call<T>(
		response: Observable<HttpResponse<string>>,
		requestType: RequestType,
		settings: HttpSettings
	): Observable<T> {
		this.onRequestStarted();
		return response.pipe(
			tap(
				resp => this.responseEventStream.next(resp),
				(resp: HttpErrorResponse) => this.responseEventStream.next(resp)
			),
			finalize(() => this.onRequestEnded()),
			map(resp => this.parseResponse(resp, settings)),
			catchError((err: HttpErrorResponse) => this.handleError(err, requestType, settings))
		);
	}

	private parseResponse(response: HttpResponse<string>, settings: HttpSettings): string | null {
		// clientResponse may be null. This is the case if the server returns an empty body! Typical example is delete requests, or the login itself.
		if (response.body === null || response.body === '') return null;

		try {
			const clientResponse =
				!settings.responseType || settings.responseType === 'json'
					? JSON.parse(response.body)
					: response.body;
			return clientResponse;
		} catch {
			return response.body;
		}
	}

	private handleError(
		response: HttpErrorResponse,
		requestType: RequestType,
		settings?: HttpSettings
	): Observable<any> {
		settings = settings || {};

		switch (response.status) {
			case 401:
				break;
			default:
				if (!settings.suppressErrorMessage)
					this.showErrorFromResponse(response, requestType);
				break;
		}

		// by this error returning we make the Observer's error handler (in the subscription!) execute - if specified ofc
		return throwError(response);
	}

	protected getErrorMessage(
		response: HttpErrorResponse,
		requestType: RequestType
	): Observable<string> {
		switch (response.status) {
			case 0:
				return of('A szerver nem elérhető');
			case 403:
				return of('Nincs elég jogosultsága a művelet végrehajtásához');
			case 404:
				if (requestType === RequestType.Delete)
					return of('Az erőforrás időközben törölve lett');
				return of('Az erőforrás nem található');
		}

		let errorMsg = '';
		try {
			if (response.error instanceof Error) errorMsg = response.error.message;
			else errorMsg = response.error;

			const json = JSON.parse(errorMsg);
			errorMsg = json.message || errorMsg;
		} catch (e) {
			errorMsg = (response.error || {}).message || response.error;
		}

		return of(errorMsg);
	}

	private onRequestStarted(): void {
		this.loadingBarService.increase();
	}

	private onRequestEnded(): void {
		this.loadingBarService.decrease();
	}

	private createDefaultRequestOptions(settings: HttpSettings): { headers: HttpHeaders } {
		const headers = new HttpHeaders()
			.set('Accept', 'application/json')
			.set('Content-Type', settings.contentType || 'application/json')
			.set('Accept-Language', LocaleUtil.getLocale());

		return <any>{
			headers,
			observe: 'response',
			responseType: settings.responseType || 'text'
		};
	}
}
