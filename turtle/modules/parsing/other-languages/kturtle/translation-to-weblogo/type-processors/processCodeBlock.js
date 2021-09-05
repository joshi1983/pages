import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

export function processCodeBlock(token, result) {
	const includeBrackets = token.parentNode.type !== ParseTreeTokenType.LEARN;
	if (includeBrackets)
		result.append('[');
	else {
		result.trimRight();
		result.append('\n');
	}
	for (let i = 0; i < token.children.length; i++) {
		const child = token.children[i];
		if (child.type !== ParseTreeTokenType.CURLY_LEFT_BRACKET &&
		child.type !== ParseTreeTokenType.CURLY_RIGHT_BRACKET) {
			processToken(child, result);
		}
	}
	if (includeBrackets)
		result.append(']');
	result.trimRight();
	result.append('\n');
};