import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentDetails, DocumentsUpdateRequest, NameCodePair } from '../../../typings-server/server-interfaces';
import { HttpService } from '../http/http.service';
import { DatabaseDocument, DatabaseDocumentType } from './model';

@Injectable()
export class DocumentsService {
	constructor(
		private readonly httpService: HttpService,
		private readonly translateService: TranslateService
	) { }

	public getDocumentTypes(): Observable<NameCodePair[]> {
		return this.httpService.get<NameCodePair[]>(`document-types`);
	}

	public getDocuments(
		type: DatabaseDocumentType,
		operationId: number
	): Observable<DatabaseDocument[]> {
		return this.httpService
			.get<DocumentDetails[]>(`${this.getTypeUrlFromType(type)}/${operationId}/documents`)
			.pipe(
				map(documents =>
					documents.map<DatabaseDocument>(doc => ({
						id: doc.id,
						fileName: doc.fileName,
						fullPath: doc.fullPath,
						description: doc.note,
						taskType: this.translateService.instant(
							`Concepts.TaskTypes.${doc.taskType}`
						),
						type: doc.type
					}))
				)
			);
	}

	public updateDocuments(
		type: DatabaseDocumentType,
		operationId: number,
		updateRequest: DocumentsUpdateRequest
	): Observable<void> {
		return this.httpService.put<void>(
			`${this.getTypeUrlFromType(type)}/${operationId}/documents`,
			updateRequest
		);
	}

	public downloadDocument(url: string): Observable<void> {
		return this.httpService.downloadFile(url) as Observable<void>;
	}

	public getTypeUrlFromType(type: DatabaseDocumentType): string {
		return type === DatabaseDocumentType.Offer ? 'offers' : 'operations';
	}
}
