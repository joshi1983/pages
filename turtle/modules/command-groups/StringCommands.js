import { isNumber } from '../isNumber.js';
import { memberp } from './helpers/memberp.js';
import { word } from './helpers/word.js';

export const directReplacements = new Map([
	['parseNumber', 'parseFloat']
]);

export class StringCommands {
	constructor() {
		this.memberp = memberp;
		this.word = word;
		this.parseNumber = parseFloat;
	}

	ascii(char1) {
		if (char1.length < 1)
			return 0;
		else
			return char1.charCodeAt(0);
	}

	char(num1) {
		return String.fromCharCode(num1);
	}

	isinstance(val, dataTypes) {
		return dataTypes.mayBeCompatibleWithValue(val);
	}

	lowerCase(s) {
		return s.toLowerCase();
	}

	split(s, separator) {
		if (separator === undefined)
			return s.split(/\s+/);

		return s.split(separator);
	}

	str(val) {
		return '' + val;
	}

	stringp(val) {
		return typeof val === 'string';
	}

	substring(s, fromIndex, toIndex) {
		if (toIndex < 0)
			toIndex = Math.max(0, s.length + toIndex);
		if (toIndex === 0)
			return s.substring(fromIndex - 1);
		else
			return s.substring(fromIndex - 1, toIndex);
	}

	substringp(s1, s2) {
		if (typeof s1 !== 'string' || typeof s2 !== 'string')
			this._warn('strings expected but got ' + s1 + ' and ' + s2 + ' in a call to substringp');
		else
			return s2.indexOf(s1) !== -1;
	}

	upperCase(s) {
		return s.toUpperCase();
	}

	wordp(val) {
		if (typeof val === 'string')
			return true;
		if (isNumber(val))
			return true;
		return false;
	}
};