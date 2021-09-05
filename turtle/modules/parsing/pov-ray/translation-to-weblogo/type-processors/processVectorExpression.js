import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

const ignoredTypes = new Set([
	ParseTreeTokenType.ANGLE_LEFT_BRACKET,
	ParseTreeTokenType.ANGLE_RIGHT_BRACKET,
	ParseTreeTokenType.COMMA
]);

export function processVectorExpression(token, result) {
	result.append('[');
	for (const child of token.children) {
		if (!ignoredTypes.has(child.type)) {
			processToken(child, result);
			result.append(' ');
		}
	}
	result.append(']');
};