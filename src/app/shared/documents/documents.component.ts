import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { finalize, switchMap, tap } from 'rxjs/operators';
import {
	DocumentCreateData,
	DocumentsUpdateRequest,
	NameCodePair,
	TaskType
} from '../../../typings-server/server-interfaces';
import { ComponentBase } from '../component/component-base';
import { FileService } from '../file/file.service';
import { NotificationService } from '../notification/notification.service';
import { DocumentsModel } from './documents.model';
import { DocumentsService } from './documents.service';
import { DatabaseDocument, DatabaseDocumentType } from './model';

@Component({
	selector: 'ccd-documents',
	templateUrl: './documents.component.html',
	styleUrls: ['./documents.component.scss'],
	providers: [DocumentsService]
})
export class DocumentsComponent extends ComponentBase implements OnInit {
	public documentTypes: NameCodePair[] = [];
	public taskTypes: NameCodePair[] = [];

	public existingDocuments: DatabaseDocument[] = [];

	public operationInProgress = false;

	@Input()
	type: DatabaseDocumentType = DatabaseDocumentType.Offer;

	@Input()
	get relatedEntityId(): number {
		return this._relatedEntityId;
	}
	set relatedEntityId(value: number) {
		if (value) {
			this._relatedEntityId = value;
			this.getData().subscribe();
		}
	}
	private _relatedEntityId = 0;

	public model: DocumentsModel;

	public get canSave(): boolean {
		return this.deletedDocuments.length > 0 || this.model.getDocumentsArray().length > 0;
	}

	private deletedDocuments: number[] = [];

	constructor(
		private readonly service: DocumentsService,
		private readonly fileService: FileService,
		private readonly notificationService: NotificationService,
		private readonly translateService: TranslateService,
		formBuilder: FormBuilder
	) {
		super();
		this.model = new DocumentsModel(formBuilder);
		this.taskTypes = [
			{
				code: TaskType.EXCISE,
				displayName: this.translateService.instant('Concepts.TaskTypes.EXCISE')
			},
			{
				code: TaskType.TRACK,
				displayName: this.translateService.instant('Concepts.TaskTypes.TRACK')
			},
			{
				code: TaskType.STORE,
				displayName: this.translateService.instant('Concepts.TaskTypes.STORE')
			}
		];
	}

	ngOnInit() {
		this.service.getDocumentTypes().subscribe(docTypes => (this.documentTypes = docTypes));
	}

	public handleNewDocument(): void {
		this.model.addEmptyControl();
	}

	public handleDocumentDelete(document: DatabaseDocument): void {
		this.deletedDocuments.push(document.id);
		this.existingDocuments = this.existingDocuments.filter(a => a.id !== document.id);
	}

	public handleNewDocumentDelete(index: number) {
		this.model.removeNewDocumentAt(index);
	}

	public handleSave(): void {
		this.model.markAsTouched();
		if (!this.model.group.valid) return;

		const request = this.getDocumentUpdateRequest();
		if (request) {
			this.operationInProgress = true;
			this.service
				.updateDocuments(this.type, this.relatedEntityId, request)
				.pipe(
					tap(() =>
						this.notificationService.showSuccess(
							this.translateService.instant('Concepts.Update_Success')
						)
					),
					switchMap(() => this.getData()),
					finalize(() => (this.operationInProgress = false))
				)
				.subscribe();
		}
	}
	public onFileSelect(event: Event, documentFormArray: FormArray): void {
		const fileIdControl = documentFormArray.controls['fileId' as any];
		const fileNameControl = documentFormArray.controls['fileName' as any];
		const uploadPercentControl = documentFormArray.controls['uploadPercent' as any];

		uploadPercentControl.setValue(0);
		const source = <HTMLInputElement>(event.srcElement || event.target);
		if (source.files) {
			const file = source.files[0];
			this.fileService
				.uploadFile(file, progress => {
					uploadPercentControl.setValue(progress);
				})
				.subscribe(
					fileId => {
						fileIdControl.setValue(fileId);
						if (!fileNameControl.value) {
							fileNameControl.setValue(file.name);
						}
					},
					error => {
						this.notificationService.showError(error);
						fileIdControl.setValue(undefined);
						fileNameControl.setValue(undefined);
						uploadPercentControl.setValue(0);
					}
				);
		}
	}

	public handleDownload(document: DatabaseDocument): void {
		this.service.downloadDocument(this.getDownloadUrl(document)).subscribe();
	}

	public getData(): Observable<DatabaseDocument[]> {
		this.deletedDocuments = [];
		this.model.applySource([]);
		if (!this.relatedEntityId) of([]);

		return this.service
			.getDocuments(this.type, this.relatedEntityId)
			.pipe(tap(documents => (this.existingDocuments = documents)));
	}

	private getDocumentUpdateRequest(): DocumentsUpdateRequest | null {
		const newFiles = this.model.getSource();
		if (newFiles.length === 0 && this.deletedDocuments.length === 0) return null;

		return {
			deletedDocumentIds: this.deletedDocuments,
			newDocuments: newFiles.map<DocumentCreateData>(a => ({
				fileId: a.fileId,
				fileName: a.fileName,
				tasktype: a.taskType as TaskType,
				type: a.type,
				note: a.description
			}))
		};
	}

	private getDownloadUrl(document: DatabaseDocument): string {
		return `${this.service.getTypeUrlFromType(this.type)}/${this.relatedEntityId}/documents/${
			document.id
		}`;
	}
}
