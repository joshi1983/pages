import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const firstTypes = new Set([
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.DATA_TYPE,
	ParseTreeTokenType.EXPRESSION_DOT,
	ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
	ParseTreeTokenType.IDENTIFIER,
]);

export function validateExpressionDot(token, parseLogger) {
	const children = token.children;
	if (children.length === 2) {
		const first = children[0];
		const last = children[1];
		if (!firstTypes.has(first.type))
			parseLogger.error(`Expected first child of EXPRESSION_DOT to have a type from ${Array.from(firstTypes).map(t => ParseTreeTokenType.getNameFor(t.type)).join(',')} but found type ${ParseTreeTokenType.getNameFor(first.type)}`, first);
		if (last.val !== '.')
			parseLogger.error(`Expected second child of EXPRESSION_DOT to have val . but found val of ${last.val}`, last);
	}
};