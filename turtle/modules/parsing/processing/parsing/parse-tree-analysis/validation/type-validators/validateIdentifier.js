import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const singleChildTypes = new Set([
	ParseTreeTokenType.GENERIC_TYPE_EXPRESSION,
	ParseTreeTokenType.UNARY_OPERATOR
]);

export function validateIdentifier(token, parseLogger) {
	const children = token.children;
	if (children.length === 1) {
		const child = children[0];
		if (!singleChildTypes.has(child.type))
			parseLogger.error(`Expected IDENTIFIER to have a single child with a type from ${Array.from(singleChildTypes).map(t => ParseTreeTokenType.getNameFor(t))} but found ${ParseTreeTokenType.getNameFor(child.type)}`, token);
	}
};