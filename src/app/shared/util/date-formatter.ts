import * as moment from 'moment';

export const APP_MAT_DATE_FORMATS = {
	parse: {
		dateInput: 'L'
	},
	display: {
		dateInput: 'L',
		monthYearLabel: 'YYYY MMMM'
	}
};

export type momentDate = moment.Moment | string | undefined;

export function formatDateToLocal(date: momentDate): string | undefined {
	return formatDateToLocalImpl(date, 'YYYY.MM.DD');
}
export function formatDatetimeToLocal(date: momentDate): string | undefined {
	return formatDateToLocalImpl(date, 'YYYY.MM.DD HH:mm');
}
function formatDateToLocalImpl(date: momentDate, format: string): string | undefined {
	if (date === null || date === undefined) return undefined;

	const momentObject = moment(date);
	return momentObject.format(format);
}

export function momentToServerDateString(date: momentDate): string | undefined {
	if (!date) return undefined;
	return moment(date).format('YYYY-MM-DD');
}

export function localDateToMoment(date: momentDate): moment.Moment | undefined {
	if (!date) return undefined;
	if (!(typeof date === 'string')) return date;

	date = date.replace(/\./g, () => '-');
	return moment(date);
}
