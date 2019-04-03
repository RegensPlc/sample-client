import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BreadcrumbItem } from './model/breadcrumb-item';

@Injectable()
export class BreadcrumbService {
	breadcrumbItems: BreadcrumbItem[] = [];

	private subject: BehaviorSubject<BreadcrumbItem[]> = new BehaviorSubject<BreadcrumbItem[]>([]);

	public setBreadcrumbItems(breadcrumbItems: BreadcrumbItem[]): void {
		this.breadcrumbItems = breadcrumbItems;
		this.subject.next(breadcrumbItems);
	}

	public getBreadcrumbItems(): Observable<BreadcrumbItem[]> {
		return this.subject.asObservable();
	}
}
