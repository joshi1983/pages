import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateExtends(token, parseLogger) {
	const children = token.children;
	if (token.val !== 'extends')
		parseLogger.error(`Expected val to be extends but found ${token.val}`, token);
	if (token.parentNode.type !== ParseTreeTokenType.IDENTIFIER)
		parseLogger.error(`Expected extends parent to be an identifier but found ${ParseTreeTokenType.getNameFor(token.parentNode.type)}`, token);
	if (children.length !== 1)
		parseLogger.error(`Expected 1 child for extends token but found ${children.length}`, token);
	else {
		const child = children[0];
		if (child.type !== ParseTreeTokenType.IDENTIFIER)
			parseLogger.error(`Expected child to be an IDENTIFIER but found ${ParseTreeTokenType.getNameFor(child.type)}`);
	}
};