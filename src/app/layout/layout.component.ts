import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ComponentBase } from './../shared/component/component-base';
import { LayoutService } from './layout.service';

@Component({
	selector: 'ccd-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss'],
	providers: [LayoutService]
})
export class LayoutComponent extends ComponentBase implements OnInit {
	isHandset$: Observable<boolean> = this.breakpointObserver
		.observe(Breakpoints.Handset)
		.pipe(map(result => result.matches));

	constructor(
		private readonly service: LayoutService,
		private readonly breakpointObserver: BreakpointObserver) {
		super();
	}

	ngOnInit(): void {
		this.addManagedSubscription(
			// 1000 milisec * 60 * 10 = 10 minutes
			interval(1000 * 60 * 10).pipe(
				switchMap(() => this.service.ping())
			).subscribe()
		);
	}
}
