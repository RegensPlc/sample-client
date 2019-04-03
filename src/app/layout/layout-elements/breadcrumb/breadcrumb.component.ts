import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentBase } from './../../../shared/component/component-base';
import { BreadcrumbService } from './breadcrumb.service';
import { BreadcrumbItem } from './model/breadcrumb-item';

@Component({
	selector: 'ccd-breadcrumb',
	templateUrl: './breadcrumb.component.html',
	styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent extends ComponentBase implements OnInit {
	public breadcrumbItems: BreadcrumbItem[] = [];
	public currentUrl: string = '';

	constructor(private breadcrumbService: BreadcrumbService, private router: Router) {
		super();
	}

	public ngOnInit(): void {
		this.addManagedSubscription(
			this.breadcrumbService
				.getBreadcrumbItems()
				.subscribe((breadcrumbItems: BreadcrumbItem[]) => {
					this.currentUrl = this.router.url;
					this.breadcrumbItems = breadcrumbItems;
				})
		);
	}
}
