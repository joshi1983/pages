import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateLoopWhile(token, parseLogger) {
	const children = token.children;
	if (children.length !== 2) {
		parseLogger.error(`Expected LOOP_WHILE to have 2 children but found ${children.length}`, token);
	}
	else {
		const first = children[0];
		const last = children[1];
		if (first.type !== ParseTreeTokenType.LOOP)
			parseLogger.error(`Expected first child of LOOP_WHILE to be a LOOP but found ${ParseTreeTokenType.getNameFor(first.type)}`, first);
		if (last.type !== ParseTreeTokenType.WHILE)
			parseLogger.error(`Expected last child of LOOP_WHILE to be a LOOP but found ${ParseTreeTokenType.getNameFor(last.type)}`, last);
	}
}