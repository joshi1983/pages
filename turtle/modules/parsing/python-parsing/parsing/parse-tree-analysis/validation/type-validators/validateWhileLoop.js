import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateWhileLoop(token, parseLogger) {
	const children = token.children;
	if (children.length < 3)
		parseLogger.error(`An WHILE_LOOP must have at least 3 children but found ${children.length}`, token);
	else if (children.length > 4)
		parseLogger.error(`An WHILE_LOOP must have at most 4 children but found ${children.length}`, token);
	else {
		const last = children[2];
		if (last.type !== ParseTreeTokenType.CODE_BLOCK)
			parseLogger.error(`The third child of a WHILE_LOOP should be a CODE_BLOCK but found type ${ParseTreeTokenType.getNameFor(last.type)}`, token);
	}
};