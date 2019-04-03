import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material';
import { NotificationType } from '../notification.service';

export interface NotificationData {
	message: string;
	title?: string;
	type: NotificationType;
}

@Component({
	selector: 'ccd-notification-displayer',
	templateUrl: './notification-displayer.component.html',
	styleUrls: ['./notification-displayer.component.scss']
})
export class NotificationDisplayerComponent {
	constructor(
		@Inject(MAT_SNACK_BAR_DATA) public data: NotificationData,
		private readonly snackbarRef: MatSnackBarRef<NotificationDisplayerComponent>
	) {}

	public getCssClass(): string {
		switch (this.data.type) {
			case NotificationType.Error:
				return 'error';
			case NotificationType.Warning:
				return 'warning';
			case NotificationType.Info:
				return 'info';
			case NotificationType.Success:
				return 'success';
			default:
				return '';
		}
	}

	public onClose(): void {
		this.snackbarRef.dismiss();
	}
}
