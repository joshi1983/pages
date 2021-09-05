import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateFunctionCall(token, parseLogger) {
	const children = token.children;
	if (children.length !== 2)
		parseLogger.error(`Expected a FUNCTION_CALL token to have 2 children but found ${children.length}`, token);
	else {
		const firstChild = children[0];
		const secondChild = children[1];
		if (firstChild.type !== ParseTreeTokenType.IDENTIFIER)
			parseLogger.error(`Expected first child of a FUNCTION_CALL to be an IDENTIFIER but found ${ParseTreeTokenType.getNameFor(firstChild.type)}`, firstChild);
		if (secondChild.type !== ParseTreeTokenType.ARG_LIST)
			parseLogger.error(`Expected second child of a FUNCTION_CALL to be an ARG_LIST but found ${ParseTreeTokenType.getNameFor(secondChild.type)}`, secondChild);
	}
};