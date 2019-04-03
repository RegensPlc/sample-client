export interface DatabaseDocument {
	id: number;
	fileName: string;
	fullPath: string;
	description: string;
	type: string;
	taskType: string;
}

export enum DatabaseDocumentType {
	Offer,
	Operation
}
