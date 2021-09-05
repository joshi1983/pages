import { forToInitToken } from './forToInitToken.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function forTokenToInitVariableName(forToken) {
	const initToken = forToInitToken(forToken);
	if (initToken === null)
		return;
	let t = initToken;
	if (t.type === ParseTreeTokenType.DECLARATION) {
		if (t.children.length === 2)
			t = t.children[1];
		else
			return;
	}
	if (t.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
		const left = t.children[0];
		if (left === undefined)
			return;
		t = left;
	}
	if (t.type === ParseTreeTokenType.IDENTIFIER)
		return t.val;
};