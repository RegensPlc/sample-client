import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'limitString' })
export class LimitStringPipe implements PipeTransform {
	transform(value: string, length: number): string {
		if (!value) return '';
		if (value.length > length) {
			const limitedString = value.substring(0, length);
			return `${limitedString}...`;
		}
		return value;
	}
}
