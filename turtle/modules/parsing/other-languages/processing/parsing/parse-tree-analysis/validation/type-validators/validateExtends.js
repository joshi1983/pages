import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateExtends(token, parseLogger) {
	const children = token.children;
	if (token.val !== 'extends')
		parseLogger.error(`Expected val to be extends but found ${token.val}`, token);
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.CLASS &&
	parent.type !== ParseTreeTokenType.INTERFACE)
		parseLogger.error(`Expected extends parent to be a class or interface but found ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	if (children.length === 0)
		parseLogger.error(`Expected at least 1 child for extends token but found ${children.length}`, token);
	else {
		for (let i = 0; i < children.length; i++) {
			const expectedType = i % 2 === 0 ? ParseTreeTokenType.IDENTIFIER : ParseTreeTokenType.COMMA;
			const child = children[i];
			if (child.type !== expectedType)
				parseLogger.error(`Expected child to be an ${ParseTreeTokenType.getNameFor(expectedType)} but found ${ParseTreeTokenType.getNameFor(child.type)}`);
		}
	}
};