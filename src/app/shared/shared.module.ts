import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	MatAutocompleteModule,
	MatButtonModule,
	MatCardModule,
	MatCheckboxModule,
	MatDatepickerModule,
	MatDialogModule,
	MatExpansionModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatMenuModule,
	MatPaginatorModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatRadioModule,
	MatSelectModule,
	MatSidenavModule,
	MatSnackBarModule,
	MatSortModule,
	MatTableModule,
	MatTabsModule,
	MatToolbarModule,
	MatTooltipModule,
	MatTreeModule
	} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { ActionsComponent } from './actions/actions.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { CostComponent } from './cost/cost.component';
import { DocumentsComponent } from './documents/documents.component';
import { ValidationDisplayerComponent } from './form/validation-displayer/validation-displayer.component';
import { LoadingBarComponent } from './loading-bar/loading-bar.component';
import { NotificationDisplayerComponent } from './notification/notification-displayer/notification-displayer.component';
import { SubMenuElementComponent } from './submenu/sub-menu-element/sub-menu-link.component';
import { SubmenuComponent } from './submenu/submenu.component';
import { CurrencyInputDirective } from './util/currency-input.directive';
import { CurrencyLocalePipe } from './util/currency-locale.pipe';
import { LimitStringPipe } from './util/limit-string.pipe';

const publicModules = [
	AngularMultiSelectModule,
	CommonModule,
	FormsModule,
	RouterModule,
	HttpClientModule,
	ReactiveFormsModule,
	MatButtonModule,
	MatCardModule,
	MatCheckboxModule,
	MatDatepickerModule,
	MatDialogModule,
	MatExpansionModule,
	MatListModule,
	MatIconModule,
	MatInputModule,
	MatMenuModule,
	MatPaginatorModule,
	MatRadioModule,
	MatToolbarModule,
	MatTooltipModule,
	MatTableModule,
	MatTabsModule,
	MatSortModule,
	MatSelectModule,
	MatSidenavModule,
	MatAutocompleteModule,
	MatTreeModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	TranslateModule,
	MatMomentDateModule,
	MatSnackBarModule
];

const sharedPipes: any[] = [CurrencyLocalePipe, LimitStringPipe];

const sharedDirectives: any[] = [CurrencyInputDirective];

const sharedComponents = [
	ActionsComponent,
	DocumentsComponent,
	SubmenuComponent,
	SubMenuElementComponent,
	ValidationDisplayerComponent,
	CostComponent,
	NotificationDisplayerComponent,
	ConfirmComponent,
	LoadingBarComponent
];

/**Shared "things" come here.
 * This means 4 things:
 * - modules WITHOUT .forRoot. modules with providers (aka having a forRoot method) must go to the AppModule!
 * - components
 * - directives
 * - pipes
 */
@NgModule({
	imports: [
		...publicModules,
		HttpClientXsrfModule.withOptions({
			cookieName: 'XSRF-TOKEN',
			headerName: 'X-XSRF-TOKEN'
		})
	],
	exports: [
		...publicModules,
		...sharedComponents,
		...sharedPipes,
		...sharedComponents,
		...sharedDirectives
	],
	declarations: [...sharedComponents, ...sharedPipes, ...sharedComponents, ...sharedDirectives],
	entryComponents: [NotificationDisplayerComponent]
})
export class SharedModule {}
