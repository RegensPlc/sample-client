import {
	Component,
	ContentChild,
	EventEmitter,
	Input,
	OnInit,
	Output,
	TemplateRef
	} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import {
	CostTypeInfo,
	NameCodePair,
	NameIdPair,
	WarehouseInfo
	} from '../../../typings-server/server-interfaces';
import { ComponentBase } from '../component/component-base';
import { ConfirmComponent } from '../confirm/confirm.component';
import { momentDate } from '../util/date-formatter';
import { CostFormGroup } from './cost-form-group';
import { CostModel } from './cost.model';
import { CostsService } from './cost.service';

@Component({
	selector: 'ccd-cost',
	templateUrl: './cost.component.html',
	styleUrls: ['./cost.component.scss'],
	providers: [CostsService]
})
export class CostComponent extends ComponentBase implements OnInit {
	@Input() public minDate: momentDate;
	@Input() public maxDate: momentDate;
	@Input() public types: CostTypeInfo[];
	@Input() public warehouses: WarehouseInfo[];
	@Input() public buildings: NameIdPair[];
	@Input() public processClosed: boolean = false;
	@Output('onDeleteCost') public deleteCostEvent: EventEmitter<number> = new EventEmitter();

	@ContentChild('upperRowTemplate') upperRowTemplate: TemplateRef<any> = <TemplateRef<any>>{};

	public model: CostModel;

	constructor(private readonly fb: FormBuilder,
		private readonly service: CostsService,
		private readonly dialog: MatDialog,
		private readonly translateService: TranslateService) {
		super();
		this.types = [];
		this.warehouses = [];
		this.buildings = [];
		this.model = new CostModel(
			this.fb,
			value => this.service.searchPartners(value),
			value => this.service.searchDevices(value)
		);
	}
	ngOnInit() { }

	public onNewCost(): void {
		if (this.processClosed) return;
		this.model.addNewCost();
	}

	public onDeleteCost(cost: CostFormGroup): void {
		if (this.processClosed) return;

		const costId = cost.getId();

		// if the cost is a brand new one (does not exist on the server yet), just delete it
		if (!costId) {
			this.model.deleteCost(cost);
		} else {
			this.dialog
				.open(ConfirmComponent, {
					data: {
						title: this.translateService.instant('Costs.Actual.Delete_Confirmation_Title'),
						message: this.translateService.instant('Costs.Actual.Delete_Confirmation_Message', { id: costId })
					}
				})
				.afterClosed()
				.subscribe((result: boolean) => {
					if (result) {
						this.deleteCostEvent.emit(costId);
					}
				});
		}
	}

	public nameIdDisplayerFn(value: NameCodePair): string {
		return value ? value.displayName : '';
	}

	public costTrackByFunction(index: number, cost: CostFormGroup): number {
		// new elements does not have id, fall back to use the index instead
		return cost.getId() || index;
	}
}
