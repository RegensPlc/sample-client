import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export class ComponentBase implements OnDestroy {
	private readonly subscriptions: Subscription[] = [];

	ngOnDestroy(): void {
		this.subscriptions.forEach(a => a.unsubscribe());
	}

	protected addManagedSubscription(subscription: Subscription): void {
		this.subscriptions.push(subscription);
	}
}
