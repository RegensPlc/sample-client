import {
	AfterViewInit,
	Component,
	OnInit,
	ViewChild
	} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { merge } from 'rxjs';
import { NameCodePair, OfferSummary } from '../../../../../typings-server/server-interfaces';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { BreadcrumbService } from '../../../layout-elements/breadcrumb/breadcrumb.service';
import { BreadcrumbItem } from '../../../layout-elements/breadcrumb/model/breadcrumb-item';
import { ComponentBase } from './../../../../shared/component/component-base';
import { OfferSearchModel, SearchFormStateService } from './offer-list.model';
import { OfferListService } from './offer-list.service';

@Component({
	selector: 'ccd-offer-list',
	templateUrl: './offer-list.component.html',
	styleUrls: ['./offer-list.component.scss'],
	providers: [OfferListService]
})
export class OfferListComponent extends ComponentBase implements OnInit, AfterViewInit {
	public dataSource: MatTableDataSource<OfferSummary> = new MatTableDataSource();
	public readonly columns = [
		'offerId',
		'partnerName',
		'typeName',
		'statusName',
		'resultName',
		'date',
		'endOfValidity'
	];
	private readonly year = moment().year();
	public readonly years = Array.from(new Array(5), (_, index) => this.year - index);
	public offerTypes: Array<NameCodePair> = Array<NameCodePair>();
	public offerStates: Array<NameCodePair> = Array<NameCodePair>();
	public offerResults: Array<NameCodePair> = Array<NameCodePair>();
	@ViewChild(MatSort) public sort: MatSort = <MatSort>{};
	@ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};
	public formModel: OfferSearchModel;

	constructor(
		readonly fb: FormBuilder,
		private readonly router: Router,
		private readonly breadcrumbService: BreadcrumbService,
		private readonly service: OfferListService,
		public readonly navigationService: NavigationService,
		private readonly translateService: TranslateService,
		private readonly searchFromStateService: SearchFormStateService
	) {
		super();
		this.formModel = new OfferSearchModel(fb);
	}

	ngOnInit() {
		this.formModel.applySource(this.searchFromStateService.offerSearchFormState);
		this.setBreadcrumb();
		this.getOfferTypes();
		this.getOfferStates();
		this.getOfferResults();
		this.onSearch();
	}

	ngAfterViewInit(): void {
		this.addManagedSubscription(
			merge(this.sort.sortChange, this.paginator.page).subscribe(() => this.onSearch())
		);
	}

	public onSearch(): void {
		if (!this.formModel.group.valid) return;

		this.service
			.getOffers(
				this.formModel.getSource(),
				this.paginator.pageIndex,
				this.paginator.pageSize,
				this.sort.active,
				this.sort.direction
			)
			.subscribe(a => {
				this.dataSource.data = a.items;
				this.paginator.length = a.count;
				this.searchFromStateService.setOfferSearchFormState(this.formModel.getSource());
			});
	}

	public elementClick(offer: OfferSummary): void {
		this.router.navigateByUrl(
			this.navigationService
				.features()
				.offers()
				.offerDetailsUrl(offer.id)
		);
	}

	private getOfferTypes(): void {
		this.service.getOfferTypes().subscribe(result => {
			this.offerTypes = result;
		});
	}

	private getOfferStates(): void {
		this.service.getOfferStates().subscribe(result => {
			this.offerStates = result;
		});
	}

	private getOfferResults(): void {
		this.service.getOfferResults().subscribe(result => {
			this.offerResults = result;
		});
	}

	private setBreadcrumb(): void {
		const breadcrumbItems: BreadcrumbItem[] = [
			new BreadcrumbItem(
				this.translateService.instant('App.Breadcrumbs.Offers.OfferHandling'),
				null
			)
		];
		this.breadcrumbService.setBreadcrumbItems(breadcrumbItems);
	}
}
