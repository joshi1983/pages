import { ParseTreeTokenType } from '../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
import { processToken } from './processToken.js';

const ignoredTypes = new Set([
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
]);

export function processCodeBlock(token, result) {
	result.append('[\n');
	for (const child of token.children) {
		if (!ignoredTypes.has(child.type)) {
			processToken(child, result);
			result.append('\n');
		}
	}
	result.append(']\n');
};