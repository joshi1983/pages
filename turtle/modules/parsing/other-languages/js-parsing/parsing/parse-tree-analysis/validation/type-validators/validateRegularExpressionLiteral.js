import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateRegularExpressionLiteral(token, parseLogger) {
	const children = token.children;
	if (children.length > 1)
		parseLogger.error(`Expected at most 1 child for a regular expression literal but found ${children.length}`, token);
	else {
		const child = children[0];
		if (child !== undefined && child.type !== ParseTreeTokenType.DOT)
			parseLogger.error(`A regular expression should either have no children or a dot as a child.  Found child of type ${ParseTreeTokenType.getNameFor(child.type)}`, token);
	}
	if (typeof token.val !== 'string')
		parseLogger.error(`Expected a regular expression literal to have a string val but got ${token.val}`, token);
};