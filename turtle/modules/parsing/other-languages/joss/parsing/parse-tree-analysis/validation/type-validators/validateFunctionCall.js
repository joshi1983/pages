import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateFunctionCall(token, parseLogger) {
	const children = token.children;
	if (children.length !== 2) {
		parseLogger.error(`Expected at least 2 children for FUNCTION_CALL but found ${children.length}`, token);
	}
	else {
		const identifier = children[0];
		const argList = children[1];
		if (identifier.type !== ParseTreeTokenType.IDENTIFIER)
			parseLogger.error(`First child of FUNCTION_CALL expected to be an IDENTIFIER but found type ${ParseTreeTokenType.getNameFor(identifier.type)}`, token);
		if (argList.type !== ParseTreeTokenType.ARG_LIST)
			parseLogger.error(`Second child of FUNCTION_CALL expected to be an ARG_LIST but found type ${ParseTreeTokenType.getNameFor(argList.type)}`, token);
	}
};