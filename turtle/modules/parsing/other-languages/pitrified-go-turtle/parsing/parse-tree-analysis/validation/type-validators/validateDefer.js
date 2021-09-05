import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateDefer(token, parseLogger) {
	const children = token.children;
	if (children.length !== 1)
		parseLogger.error(`Expected 1 child for DEFER but found ${children.length}`, token);
	else {
		const child = children[0];
		if (child.type !== ParseTreeTokenType.FUNC_CALL)
			parseLogger.error(`Expected child of DEFER to be a FUNC_CALL but found ${ParseTreeTokenType.getNameFor(child.type)}`, token);
	}
};