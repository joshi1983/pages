import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateAttributeSelector(token, parseLogger) {
	const children = token.children;
	if (children.length < 3)
		parseLogger(`At least 3 children expected for ATTRIBUTE_SELECTOR but found ${children.length}`, token);
	else {
		const first = children[0];
		const last = children[children.length - 1];
		if (first.type !== ParseTreeTokenType.SQUARE_LEFT_BRACKET)
			parseLogger.error(`Expected first child of ATTRIBUTE_SELECTOR to be a SQUARE_LEFT_BRACKET but found ${ParseTreeTokenType.getNameFor(first.type)}`, first);
		if (last.type !== ParseTreeTokenType.SQUARE_RIGHT_BRACKET)
			parseLogger.error(`Expected last child of ATTRIBUTE_SELECTOR to be a SQUARE_RIGHT_BRACKET but found ${ParseTreeTokenType.getNameFor(last.type)}`, last);
	}
};