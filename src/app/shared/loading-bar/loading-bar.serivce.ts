import { Injectable } from '@angular/core';

@Injectable()
export class LoadingBarService {
	public get isVisible(): boolean {
		return this.counter > 0;
	}

	private get counter(): number {
		return this._counter;
	}
	private set counter(value: number) {
		this._counter = value || 0;
	}
	private _counter: number = 0;

	public increase(): void {
		this.counter++;
	}

	public decrease(): void {
		this.counter--;
	}
}
