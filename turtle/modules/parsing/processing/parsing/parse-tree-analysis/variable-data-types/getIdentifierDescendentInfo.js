import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { ProcessingIdentifiers } from
'../../../ProcessingIdentifiers.js';

export function getIdentifierDescendentInfo(children) {
	if (children.length !== 1)
		return;
	let first = children[0];
	if (first.type !== ParseTreeTokenType.DOT)
		return;
	children = first.children;
	if (children.length !== 1)
		return;
	first = children[0];
	if (first.type !== ParseTreeTokenType.IDENTIFIER)
		return;
	return ProcessingIdentifiers.getIdentifierInfo(first.val, true);
};