import { Operators } from '../Operators.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function getGoodFirstChild(token) {
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR ||
	token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
		const info = Operators.getOperatorInfo(token.val);
		if (info.precedence < 1)
			return getGoodFirstChild(token.children[1]);
	}
	return token;
}

export function fixOperatorPrecedenceForTernary(allTokens) {
	const ternaryTokens = allTokens.filter(t =>
		t.type === ParseTreeTokenType.CONDITIONAL_TERNARY && t.children.length === 5);
	ternaryTokens.forEach(function(ternary) {
		const condition = ternary.children[0];
		const child = getGoodFirstChild(condition);
		if (child !== condition) {
			const childParent = child.parentNode;
			const ternaryParent = ternary.parentNode;
			ternary.replaceChild(condition, child, true);
			childParent.replaceChild(child, ternary, true);
			ternaryParent.replaceChild(ternary, childParent);
		}
	});
};