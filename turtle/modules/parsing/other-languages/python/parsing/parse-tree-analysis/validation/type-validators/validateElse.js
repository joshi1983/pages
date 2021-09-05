import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

const goodParentTypes = new Set([
	ParseTreeTokenType.FOR_LOOP,
	ParseTreeTokenType.IF_STATEMENT,
	ParseTreeTokenType.WHILE_LOOP
]);

export function validateElse(token, parseLogger) {
	const parent = token.parentNode;
	if (!goodParentTypes.has(parent.type))
		parseLogger.error(`The parent of an ELSE should be IF_STATEMENT or WHILE_LOOP but found ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	const children = token.children;
	if (children.length === 2) {
		const first = children[0];
		const last = children[1];
		if (first.type !== ParseTreeTokenType.COLON)
			parseLogger.error(`The first child of an ELSE should be a COLON but found type ${ParseTreeTokenType.getNameFor(first.type)}`, token);
		if (last.type !== ParseTreeTokenType.CODE_BLOCK)
			parseLogger.error(`The last child of an ELSE should be a CODE_BLOCK but found type ${ParseTreeTokenType.getNameFor(last.type)}`, token);
	}
};