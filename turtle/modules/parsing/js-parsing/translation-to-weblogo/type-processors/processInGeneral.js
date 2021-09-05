import { processTokens } from './helpers/processTokens.js';

export function processInGeneral(processToken) {
	if (typeof processToken !== 'function')
		throw new Error(`processToken must be a function but got ${processToken}`);
	return function(token, result, settings) {
		if (token.val !== null)
			result.append(token.val);
		processTokens(processToken, token.children, result, settings);
	};
};