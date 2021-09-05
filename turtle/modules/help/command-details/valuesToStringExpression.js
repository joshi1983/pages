import { valueToString } from '../../valueToString.js';

export function valuesToStringExpression(values) {
	let result = '';
	for (let i = 0 ; i < values.length - 1; i++) {
		if (result !== '')
			result += ', ';
		result += valueToString(values[i]);
	}
	if (values.length > 1)
		result += ' or ';
	if (values.length !== 0)
		result += valueToString(values[values.length - 1]);
	return result;
};