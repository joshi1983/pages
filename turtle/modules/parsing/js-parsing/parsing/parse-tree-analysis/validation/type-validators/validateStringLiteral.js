import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const childTypes = new Set([
ParseTreeTokenType.DOT,
ParseTreeTokenType.INDEX_EXPRESSION
]);

export function validateStringLiteral(token, parseLogger) {
	const children = token.children;
	if (children.length > 1)
		parseLogger.error(`Expected at most 1 child for a string literal but found ${children.length} children`, token);
	else {
		const child = children[0];
		if (child !== undefined && !childTypes.has(child.type))
			parseLogger.error(`A string should either have no children or a ${Array.from(childTypes).map(t => ParseTreeTokenType.getNameFor(t)).join(',')} type token as a child.  Found child of type ${ParseTreeTokenType.getNameFor(child.type)}`, token);
	}
	if (typeof token.val !== 'string')
		parseLogger.error(`Expected a string literal to have a string val but got ${token.val}`, token);
	else if (token.val[0] !== token.val[token.val.length - 1])
		parseLogger.error(`Expected a string literal to begin and end with the same quotation mark but different characters found in ${token.val}`, token);
};