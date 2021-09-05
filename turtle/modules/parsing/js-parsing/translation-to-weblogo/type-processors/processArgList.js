import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processTokens } from './helpers/processTokens.js';

const ignoredTypes = new Set([
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET
]);

function isOfInterest(token) {
	return !ignoredTypes.has(token.type);
}

export function processArgList(processToken) {
	if (typeof processToken !== 'function')
		throw new Error(`processToken must be a function but got ${processToken}`);
	return function(token, result, settings) {
		const filteredChildren = token.children.filter(isOfInterest);
		processTokens(processToken, filteredChildren, result, settings);
	};
};