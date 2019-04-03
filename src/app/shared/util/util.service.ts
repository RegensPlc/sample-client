import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {
	public isNullOrUndefined(value: any): boolean {
		return value === undefined || value === null;
	}

	/**Gets whether the value is undefined, null, empty string or NaN (if type is number).*/
	public isEmpty(value: any): boolean {
		return (
			this.isNullOrUndefined(value) ||
			value === '' ||
			(typeof value === 'number' && isNaN(value))
		);
	}

	/**Converts any object to a boolean value.
	 * For boolean inputs returns the input.
	 * For string inputs the returned value is true if the string === 'true' (case insensitive).
	 * Otherwise (including null & undefined inputs) returns the given default value.
	 */
	public convertToBoolean(value: any, defaultValue: boolean): boolean {
		let result: boolean;

		switch (typeof value) {
			case 'boolean':
				result = value;
				break;
			case 'string':
				result = this.stringToBoolean(value);
				break;
			default:
				result = defaultValue;
				break;
		}

		return result;
	}

	public parseFileNameFromDispositionHeader(headerValue: string): string | null {
		const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
		const matches = filenameRegex.exec(headerValue);
		if (matches != null && matches[1]) {
			const filename = matches[1].replace(/['"]/g, '');
			return filename;
		}
		return null;
	}

	/**Converts the string to boolean. Undefined, null, non-bool values are all 'false'. */
	private stringToBoolean(str: string): boolean {
		if (this.isEmpty(str)) return false;

		return str.toLowerCase() === 'true' ? true : false;
	}
}
