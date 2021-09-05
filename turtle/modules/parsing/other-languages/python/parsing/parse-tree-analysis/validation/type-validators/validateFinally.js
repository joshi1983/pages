import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateFinally(token, parseLogger) {
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.TRY)
		parseLogger.error(`A FINALLY should not have a parent of type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	const children = token.children;
	if (children.length === 2) {
		const first = children[0];
		const codeBlock = children[1];
		if (first.val !== ':')
			parseLogger.error(`First child of a FINALLY should be a : but found something else.`, token);
		if (codeBlock.type !== ParseTreeTokenType.CODE_BLOCK)
			parseLogger.error(`Second child of a FINALLY should be a CODE_BLOCK but found type ${ParseTreeTokenType.getNameFor(codeBlock.type)}.`, token);
	}
};