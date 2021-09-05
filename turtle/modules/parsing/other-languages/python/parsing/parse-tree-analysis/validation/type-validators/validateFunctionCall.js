import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateFunctionCall(token, parseLogger) {
	const children = token.children;
	if (children.length === 1) {
		const first = children[0];
		if (first.type !== ParseTreeTokenType.ARGUMENT_LIST)
			parseLogger.error(`Expected second child of FUNCTION_CALL to be ARGUMENT_LIST but found ${ParseTreeTokenType.getNameFor(second.type)}`, token);
	}
};