import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateIf(token, parseLogger) {
	const children = token.children;
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.END_IF) {
		if (children.length !== 0)
			parseLogger.error(`Expected IF in an END_IF to have 0 children but found ${children.length}`, token);
	}
	else {
		if (children.length >= 3) {
			const thenToken = children[1];
			if (thenToken.type !== ParseTreeTokenType.THEN)
				parseLogger.error(`Expected second child of IF to be then but found ${ParseTreeTokenType.getNameFor(thenToken)} with val ${thenToken.val}`, thenToken);
			const lastChild = children[children.length - 1];
			if (lastChild.type !== ParseTreeTokenType.END_IF)
				parseLogger.error(`Expected last child to be END_IF but got type ${ParseTreeTokenType.getNameFor(lastChild.type)}`, lastChild);
		}
		else
			parseLogger.error(`IF should have at least 3 children but found ${children.length}`, token);
	}
};