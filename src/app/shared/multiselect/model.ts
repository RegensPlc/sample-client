import { TranslateService } from '@ngx-translate/core';

export interface MultiSelectSettings {
	primaryKey?: string;
	labelKey?: string;
	enableSearchFilter?: boolean;
	enableCheckAll?: boolean;
	searchAutofocus?: true;
	classes?: string;
	text?: string;
	noDataLabel?: string;
	selectAllText?: string;
	unSelectAllText?: string;
	badgeShowLimit?: number;
	searchPlaceholderText?: string;
	/**If this is true, the component has to take care of the AngularMultiSelect.itemHeigt (by default it is 41.6px) field along with
	 * reinitializing the AngularMultiSelect.data and calling AngularMultiSelect.ngOninit() whenever the datasource changes. */
	lazyLoading?: boolean;
	/**Max height of the panel open. By default it is 300px */
	maxHeight?: number;
}

export function getDefaultMultiSelectSettings(
	translateService: TranslateService
): MultiSelectSettings {
	return {
		primaryKey: 'id',
		labelKey: 'displayName',
		enableSearchFilter: true,
		enableCheckAll: true,
		searchAutofocus: true,
		classes: 'multi-select-autocomplete',
		selectAllText: translateService.instant('MultiSelect.SelectAll'),
		unSelectAllText: translateService.instant('MultiSelect.UnselectAll'),
		searchPlaceholderText: translateService.instant('MultiSelect.SearchPlaceholder'),
		noDataLabel: translateService.instant('MultiSelect.NoDataLabel'),
		lazyLoading: true
	};
}
