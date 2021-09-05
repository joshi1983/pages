import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateCurlyRightBracket(token, parseLogger) {
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.CODE_BLOCK) {
		parseLogger.error(`Expected parent of CURLY_RIGHT_BRACKET to be a CODE_BLOCK but found ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	}
};