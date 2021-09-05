import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const nonParentTypes = new Set([
	ParseTreeTokenType.CLASS_BODY,
	ParseTreeTokenType.FUNCTION,
]);

export function validateFunctionCall(token, parseLogger) {
	const children = token.children;
	if (token.val !== null)
		parseLogger.error(`Expected val to be null but found ${token.val}`, token);
	if (nonParentTypes.has(token.parentNode.type))
		parseLogger.error(`Did not expected a FUNCTION_CALL token to have a parent of type ${ParseTreeTokenType.getNameFor(token.parentNode.type)}`, token);		
	if (children.length !== 2) {
		parseLogger.error(`Expected 2 children for function call but found ${children.length}`, token);
	}
	else {
		const lastChild = children[1];
		if (lastChild.type !== ParseTreeTokenType.ARG_LIST)
			parseLogger.error(`Expected last child to be an ARG_LIST but found ${ParseTreeTokenType.getNameFor(lastChild.type)}`, token);
	}
};