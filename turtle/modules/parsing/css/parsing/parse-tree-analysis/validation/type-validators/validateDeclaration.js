import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateDeclaration(token, parseLogger) {
	const children = token.children;
	if (children.length < 3 || children.length > 4)
		parseLogger.error(`Expected a DECLARATION token to have at 3 or 4 children but found ${children.length}`, token);
	else {
		const firstChild = children[0];
		const secondChild = children[1];
		const thirdChild = children[2];
		if (firstChild.type !== ParseTreeTokenType.IDENTIFIER)
			parseLogger.error(`Expected first child of a DECLARATION to be an IDENTIFIER but found ${ParseTreeTokenType.getNameFor(firstChild.type)}`, firstChild);
		if (secondChild.type !== ParseTreeTokenType.COLON)
			parseLogger.error(`Expected second child of a DECLARATION to be an : but found ${ParseTreeTokenType.getNameFor(secondChild.type)}`, secondChild);
		if (children.length > 3) {
			const lastChild = children[3];
			if (lastChild.type !== ParseTreeTokenType.SEMICOLON)
				parseLogger.error(`Expected children[3] of a DECLARATION to be an ; but found ${ParseTreeTokenType.getNameFor(lastChild.type)}`, secondChild);
		}
	}
};