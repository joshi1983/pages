import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';
const bracketTypes = new Set([
	ParseTreeTokenType.CURVED_LEFT_BRACKET, 
	ParseTreeTokenType.CURVED_RIGHT_BRACKET
]);

export function processArgumentListToken(token, result, cachedParseTree, settings) {
	const children = token.children;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (!bracketTypes.has(child)) {
			processToken(child, result, cachedParseTree, settings);
			result.append(' ');
		}
	}
};