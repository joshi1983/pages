import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateArrayDimensionIndicator(token, parseLogger) {
	const children = token.children;
	if (children.length === 2) {
		const first = children[0];
		const last = children[1];
		if (first.type !== ParseTreeTokenType.SQUARE_LEFT_BRACKET)
			parseLogger.error(`The first child of ARRAY_DIMENSION_INDICATOR must be a [ but got ${first.val}`, token);
		if (last.type !== ParseTreeTokenType.SQUARE_RIGHT_BRACKET)
			parseLogger.error(`The last child of ARRAY_DIMENSION_INDICATOR must be a ] but got ${last.val}`, token);
	}
};