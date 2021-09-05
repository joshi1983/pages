import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateStringLiteral(token, parseLogger) {
	const children = token.children;
	if (children.length > 1)
		parseLogger.error(`Expected at most 1 child for a string literal but found ${children.length} children`, token);
	else {
		const child = children[0];
		if (child !== undefined && child.type !== ParseTreeTokenType.DOT)
			parseLogger.error(`A string should either have no children or a dot as a child.  Found child of type ${ParseTreeTokenType.getNameFor(child.type)}`, token);
	}
	if (typeof token.val !== 'string')
		parseLogger.error(`Expected a string literal to have a string val but got ${token.val}`, token);
	else if (token.val[0] !== token.val[token.val.length - 1])
		parseLogger.error(`Expected a string literal to begin and end with the same quotation mark but different characters found in ${token.val}`, token);
};