import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function getSpreadToken(forToken) {
	const children = forToken.children;
	if (children.length < 2)
		return;

	let rangeIndex = 2;
	const firstChild = children[0];
	if (firstChild.type === ParseTreeTokenType.DECREASING)
		rangeIndex++;

	let rangeToken = children[rangeIndex];
	if (rangeToken === undefined ||
	rangeToken.type !== ParseTreeTokenType.BINARY_OPERATOR)
		return;

	if (rangeToken.val.toLowerCase() === 'by') {
		rangeToken = rangeToken.children[0];
	}
	if (rangeToken !== undefined &&
	rangeToken.type === ParseTreeTokenType.BINARY_OPERATOR &&
	rangeToken.val === '..')
		return rangeToken;
}