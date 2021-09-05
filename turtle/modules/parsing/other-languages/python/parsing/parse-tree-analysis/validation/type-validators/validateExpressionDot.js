import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

export function validateExpressionDot(token, parseLogger) {
	const children = token.children;
	if (children.length === 2) {
		const second = children[1];
		if (second.type !== ParseTreeTokenType.DOT)
			parseLogger.error(`Second child of an EXPRESSION_DOT should be a DOT but found type ${ParseTreeTokenType.getNameFor(second.type)}`, token);
	}
};