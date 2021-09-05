import { processToken } from './processToken.js';

export function processTokenOrString(val, result) {
	if (typeof val === 'string')
		result.append(' ' + val + ' ');
	else
		processToken(val, result);
};