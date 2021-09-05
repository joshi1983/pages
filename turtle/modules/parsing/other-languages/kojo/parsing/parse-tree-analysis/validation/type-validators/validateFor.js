import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateFor(token, parseLogger) {
	const children = token.children;
	if (children.length === 0 || children.length > 2)
		parseLogger.error(`Expected 1 to 2 children for FOR but found ${children.length}`, token);
	else {
		const lastChildToken = children[children.length - 1];
		const firstChild = children[0];
		if (firstChild.type !== ParseTreeTokenType.FOR_LOOP_SETTINGS)
			parseLogger.error(`Expected first child of FOR to be a FOR_LOOP_SETTINGS but found ${ParseTreeTokenType.getNameFor(firstChild.type)}`, token);
			
		if (lastChildToken.type !== ParseTreeTokenType.CODE_BLOCK)
			parseLogger.error(`Expected last child of FOR to be a CODE_BLOCK but found ${ParseTreeTokenType.getNameFor(lastChildToken.type)}`, token);
	}
};