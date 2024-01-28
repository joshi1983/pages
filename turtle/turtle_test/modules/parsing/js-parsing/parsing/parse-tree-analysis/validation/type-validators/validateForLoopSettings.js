import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateForLoopSettings(token, parseLogger) {
	const children = token.children;
	if (children.length < 3)
		parseLogger.error(`Expected at least 3 child tokens of a FOR_LOOP_SETTINGS but found ${children.length}`, token);
	else {
		const firstChild = children[0];
		const lastChild = children[children.length - 1];
		if (firstChild.type !== ParseTreeTokenType.CURVED_LEFT_BRACKET)
			parseLogger.error(`Expected first child of FOR_LOOP_SETTINGS to be a CURVED_LEFT_BRACKET but got type ${ParseTreeTokenType.getNameFor(firstChild.type)}`, token);
		if (lastChild.type !== ParseTreeTokenType.CURVED_RIGHT_BRACKET)
			parseLogger.error(`Expected last child of FOR_LOOP_SETTINGS to be an CURVED_RIGHT_BRACKET but got type ${ParseTreeTokenType.getNameFor(lastChild.type)}`, token);
	}
};