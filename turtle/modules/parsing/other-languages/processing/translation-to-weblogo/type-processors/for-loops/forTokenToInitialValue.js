import { evaluateToken } from
'../../../parsing/parse-tree-analysis/variable-data-types/evaluation/evaluateToken.js';
import { forToInitToken } from
'./forToInitToken.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function forTokenToInitialValue(forToken) {
	const initToken = forToInitToken(forToken);
	if (initToken === null)
		return;

	let assignToken = initToken;
	if (assignToken.type === ParseTreeTokenType.DECLARATION) {
		if (assignToken.children.length === 2) {
			assignToken = assignToken.children[1];
		}
		else
			return;
	}
	if (assignToken.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	assignToken.children.length === 2) {
		if (assignToken.val === '=') {
			return evaluateToken(assignToken.children[1]);
		}
		return;
	}
};