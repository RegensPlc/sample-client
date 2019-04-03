import {
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	Validators
	} from '@angular/forms';
import { FormModelBase, markControlsAsTouched } from '../../shared/form/form-model-base';
import { DatabaseDocument } from './model';

export type DocumentsFormSource = Exclude<DatabaseDocument, 'id' | 'fullPath'> & {
	fileId: string;
};

export class DocumentsModel extends FormModelBase<DocumentsFormSource[]> {
	public group: FormGroup;

	constructor(private readonly formBuilder: FormBuilder) {
		super();
		this.group = formBuilder.group({
			documents: new FormArray([])
		});
	}

	public getGroupsInsideDocumentsArray(): FormGroup[] {
		return this.getDocumentsArray().controls.map(a => a as FormGroup);
	}

	public applySource(source: DocumentsFormSource[]): void {
		const array = this.getDocumentsArray();
		array.controls = [];

		for (const document of source) {
			const group = this.formBuilder.group({
				uploadPercent: new FormControl(100, []),
				fileId: new FormControl(document.fileName, [Validators.required]),
				fileName: new FormControl(document.fileName, [Validators.required]),
				taskType: new FormControl(document.taskType, [Validators.required]),
				type: new FormControl(document.type, [Validators.required]),
				description: new FormControl(document.description, [])
			});
			array.push(group);
		}
	}
	public getSource(): DocumentsFormSource[] {
		const groups = this.getDocumentsArray().controls as FormGroup[];
		return groups.map<DocumentsFormSource>(c => ({
			fileId: c.controls['fileId'].value,
			fileName: c.controls['fileName'].value,
			taskType: c.controls['taskType'].value,
			type: c.controls['type'].value,
			description: c.controls['description'].value
		} as DocumentsFormSource));
	}

	public addEmptyControl() {
		const group = this.formBuilder.group({
			uploadPercent: new FormControl(0, []),
			fileId: new FormControl(null, [Validators.required]),
			fileName: new FormControl(null, [Validators.required]),
			taskType: new FormControl(null, [Validators.required]),
			type: new FormControl(null, [Validators.required]),
			description: new FormControl(null, [])
		});
		this.getDocumentsArray().push(group);
	}

	public removeNewDocumentAt(index: number) {
		this.getDocumentsArray().removeAt(index);
	}

	public markAsTouched(): void {
		markControlsAsTouched(this.group);
	}

	public getDocumentsArray(): FormArray {
		return this.group.controls['documents'] as FormArray;
	}
}
