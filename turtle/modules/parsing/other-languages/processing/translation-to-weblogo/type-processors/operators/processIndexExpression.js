import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';

export function processIndexExpression(token, result, settings) {
	const children = token.children;
	if (children.length >= 2) {
		result.trimRight();
		result.append(' ');
		const child = children[1];
		if (child.type === ParseTreeTokenType.NUMBER_LITERAL)
			result.append('' + (parseInt(child.val) + 1));
		else {
			result.append('1 + ');
			processToken(child, result, settings);
		}
		result.trimRight();
		result.append(' ');
	}
}