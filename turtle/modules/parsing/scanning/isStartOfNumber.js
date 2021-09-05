import { isNumeric } from './Numbers.js';

const regex = /^[+-]?[0-9]*\.?[0-9]*(e[+-]?[0-9]*)?$/i;

export function isStartOfNumber(s) {
	if (s === '' || s === '-' || s === '+')
		return false;
	if (s[0].toLowerCase() === 'e')
		return false;
	if (isNumeric(s))
		return true;
	if (regex.test(s))
		return true;
	return false;
};