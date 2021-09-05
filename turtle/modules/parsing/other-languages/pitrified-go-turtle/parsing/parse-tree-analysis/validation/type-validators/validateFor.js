import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateFor(token, parseLogger) {
	if (token.children.length === 0 || token.children.length > 6)
		parseLogger.error(`Expected 1 to 6 children for FOR but found ${token.children.length}`, token);
	else {
		const lastChildToken = token.children[token.children.length - 1];
		if (lastChildToken.type !== ParseTreeTokenType.CODE_BLOCK)
			parseLogger.error(`Expected last child of FOR to be a CODE_BLOCK but found ${ParseTreeTokenType.getNameFor(lastChildToken.type)}`, token);
	}
};