import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateWhileLoop(token, parseLogger) {
	const children = token.children;
	if (children.length < 3)
		parseLogger.error(`An WHILE_LOOP must have at least 3 children but found ${children.length}`, token);
	else {
		const last = children[children.length - 1];
		if (last.type !== ParseTreeTokenType.CODE_BLOCK)
			parseLogger.error(`The last child of a WHILE_LOOP should be a CODE_BLOCK but found type ${ParseTreeTokenType.getNameFor(last.type)}`, token);
	}
};