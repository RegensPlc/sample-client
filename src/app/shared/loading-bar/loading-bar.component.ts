import { Component } from '@angular/core';
import { LoadingBarService } from './loading-bar.serivce';

@Component({
	selector: 'ccd-loading-bar',
	templateUrl: './loading-bar.component.html',
	styleUrls: ['./loading-bar.component.scss']
})
export class LoadingBarComponent {
	constructor(public service: LoadingBarService) {}
}
