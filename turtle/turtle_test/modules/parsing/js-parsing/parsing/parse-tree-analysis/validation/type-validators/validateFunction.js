import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateFunction(token, parseLogger) {
	const children = token.children;
	if (token.val !== 'function')
		parseLogger.error(`Expected FUNCTION type token to have a val of function but got ${token.val}`, token);
	if (children.length > 4)
		parseLogger.error(`Expected at most 4 children of a FUNCTION but found ${children.length}`, token);
	else if (children.length === 4) {
		const firstChild = children[0];
		if (firstChild.type !== ParseTreeTokenType.GENERATOR_STAR)
			parseLogger.error(`If a FUNCTION token has 4 children, the first should be a GENERATOR_STAR but found ${ParseTreeTokenType.getNameFor(firstChild.type)}`, token);
	}
	else if (children < 2)
		parseLogger.error(`A FUNCTION token should have at least 2 children but found ${children.length}`, token);
	const lastChild = children[children.length - 1];
	if (lastChild !== undefined && lastChild.type !== ParseTreeTokenType.CODE_BLOCK)
		parseLogger.error(`A FUNCTION token should have a last child of type CODE_BLOCK but found ${ParseTreeTokenType.getNameFor(lastChild.type)}`, token);
};