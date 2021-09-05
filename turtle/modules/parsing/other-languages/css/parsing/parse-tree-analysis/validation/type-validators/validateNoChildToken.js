import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateNoChildToken(token, parseLogger) {
	if (token.children.length !== 0) {
		parseLogger.error(`Expected no children for tokens of type ${ParseTreeTokenType.getNameFor(token.type)} but found ${token.children.length}`, token);
	}
};