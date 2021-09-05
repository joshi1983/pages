import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

export function validateElif(token, parseLogger) {
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.IF_STATEMENT)
		parseLogger.error(`The parent of an ELIF should be IF_STATEMENT but found ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	const children = token.children;
	if (children.length === 3) {
		const second = children[1];
		const last = children[2];
		if (second.type !== ParseTreeTokenType.COLON)
			parseLogger.error(`The second child of an ELIF should be a COLON but found type ${ParseTreeTokenType.getNameFor(second.type)}`, token);
		if (last.type !== ParseTreeTokenType.CODE_BLOCK)
			parseLogger.error(`The last child of an ELIF should be a CODE_BLOCK but found type ${ParseTreeTokenType.getNameFor(last.type)}`, token);
	}
};