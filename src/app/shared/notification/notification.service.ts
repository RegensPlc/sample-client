import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, SimpleSnackBar } from '@angular/material';
import { NotificationData, NotificationDisplayerComponent } from './notification-displayer/notification-displayer.component';

export const enum NotificationType {
	Error,
	Warning,
	Info,
	Success
}

@Injectable()
export class NotificationService {
	private readonly snackbarConfig: MatSnackBarConfig<SimpleSnackBar> = {};

	constructor(private snackbar: MatSnackBar) {}
	public showError(message: string, title?: string): void {
		this.snackbar.openFromComponent(NotificationDisplayerComponent, {
			...this.snackbarConfig,
			data: <NotificationData>{
				title,
				message,
				type: NotificationType.Error
			}
		});
	}

	public showWarning(message: string, title?: string): void {
		this.snackbar.openFromComponent(NotificationDisplayerComponent, {
			...this.snackbarConfig,
			duration: 3000,
			data: <NotificationData>{
				title,
				message,
				type: NotificationType.Warning
			}
		});
	}

	public showInfo(message: string, title?: string): void {
		this.snackbar.openFromComponent(NotificationDisplayerComponent, {
			...this.snackbarConfig,
			duration: 2000,
			data: <NotificationData>{
				title,
				message,
				type: NotificationType.Info
			}
		});
	}

	public showSuccess(message: string, title?: string): void {
		this.snackbar.openFromComponent(NotificationDisplayerComponent, {
			...this.snackbarConfig,
			duration: 2000,
			data: <NotificationData>{
				title,
				message,
				type: NotificationType.Success
			}
		});
	}
}
