import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../../shared/navigation/navigation.service';
import { HttpServiceOptions } from './../../../shared/http/http-service-options';
import { MenuService } from './menu.service';

@Component({
	selector: 'ccd-menu',
	styleUrls: ['./menu.component.scss'],
	templateUrl: './menu.component.html',
	providers: [MenuService]
})
export class MenuComponent implements OnInit {
	public version: String = '';

	constructor(
		private readonly service: MenuService,
		public readonly navigationService: NavigationService,
		private readonly httpServiceOptions: HttpServiceOptions
	) { }

	public ngOnInit(): void {
		this.service.getServerInfo().subscribe(info => {
			this.version = `${info.buildInfo.environment} ${info.buildInfo.version}`;
			this.httpServiceOptions.maxUploadFileSize = info.maxFileSize;
		});
	}
}
