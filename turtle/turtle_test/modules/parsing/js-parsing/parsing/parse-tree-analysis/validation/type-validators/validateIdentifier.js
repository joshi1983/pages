import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const singleChildTypes = new Set([
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.EXTENDS,
	ParseTreeTokenType.UNARY_OPERATOR
]);

export function validateIdentifier(token, parseLogger) {
	const children = token.children;
	if (children.length > 2)
		parseLogger.error(`Expected at most 2 children for an IDENTIFIER token but found ${children.length}`, token);
	else if (children.length === 1) {
		const child = children[0];
		if (!singleChildTypes.has(child.type))
			parseLogger.error(`Expected IDENTIFIER to have a single child with a type from ${Array.from(singleChildTypes).map(t => ParseTreeTokenType.getNameFor(t))} but found ${ParseTreeTokenType.getNameFor(child.type)}`, token);
	}
	else if (children.length === 2) {
		const firstChild = children[0];
		const secondChild = children[1];
		if (firstChild.type !== ParseTreeTokenType.ARG_LIST)
			parseLogger.error(`Expected first child to be an ARG_LIST but got ${ParseTreeTokenType.getNameFor(firstChild.type)}`, token);
		if (secondChild.type !== ParseTreeTokenType.CODE_BLOCK)
			parseLogger.error(`Expected second child to be a CODE_BLOCK but got ${ParseTreeTokenType.getNameFor(secondChild.type)}`, token);
	}
};