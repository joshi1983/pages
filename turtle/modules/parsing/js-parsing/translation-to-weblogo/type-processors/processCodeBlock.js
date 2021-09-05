import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const ignoredTypes = new Set([
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
]);

export function processCodeBlock(processToken) {
	if (typeof processToken !== 'function')
		throw new Error(`processToken must be a function but got ${processToken}`);
	return function(token, result) {
		result.append('[\n');
		for (const child of token.children) {
			if (!ignoredTypes.has(child.type)) {
				processToken(child, result);
				result.append('\n');
			}
		}
		result.append(']\n');
	};
};