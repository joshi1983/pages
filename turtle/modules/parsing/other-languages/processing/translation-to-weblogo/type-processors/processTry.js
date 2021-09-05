import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processCodeBlock } from './processCodeBlock.js';

function findFinally(tokens) {
	for (const child of tokens) {
		if (child.type === ParseTreeTokenType.FINALLY)
			return child;
	}
}

export function processTry(token, result, settings) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	if (children.length !== 0) {
		const first = children[0];
		processCodeBlock(first, result, settings, false);
		const finallyToken = findFinally(children);
		if (finallyToken !== undefined &&
		finallyToken.children.length !== 0) {
			processCodeBlock(finallyToken.children[0], result, settings, false);
		}
	}
};