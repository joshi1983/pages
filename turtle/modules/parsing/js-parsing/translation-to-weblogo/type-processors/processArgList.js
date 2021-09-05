import { filterBracketsAndCommas } from './helpers/filterBracketsAndCommas.js';
import { processTokens } from './helpers/processTokens.js';

export function processArgList(processToken) {
	if (typeof processToken !== 'function')
		throw new Error(`processToken must be a function but got ${processToken}`);
	return function(token, result, settings) {
		const filteredChildren = filterBracketsAndCommas(token.children);
		processTokens(processToken, filteredChildren, result, settings);
	};
};