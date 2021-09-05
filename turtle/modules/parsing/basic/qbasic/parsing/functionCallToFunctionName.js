import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

export function functionCallToFunctionName(callToken) {
	const firstChild = callToken.children[0];
	if (firstChild === undefined)
		return;
	if (firstChild.type === ParseTreeTokenType.IDENTIFIER)
		return firstChild.val.toLowerCase();
	if (firstChild.type === ParseTreeTokenType.COMPOSITE_IDENTIFIER &&
	firstChild.children.length !== 0) {
		return firstChild.children.map(t => t.val).join(' ').toLowerCase();
	}
};