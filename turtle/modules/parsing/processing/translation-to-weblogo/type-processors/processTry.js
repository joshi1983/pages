import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

function findFinally(tokens) {
	for (const child of tokens) {
		if (child.type === ParseTreeTokenType.FINALLY)
			return child;
	}
}

export function processTry(token, result, settings) {
	const children = token.children;
	if (children.length !== 0) {
		const first = children[0];
		processToken(first, result, settings);
		const finallyToken = findFinally(children);
		if (finallyToken !== undefined &&
		finallyToken.children.length !== 0) {
			processToken(finallyToken.children[0], result, settings);
		}
	}
};