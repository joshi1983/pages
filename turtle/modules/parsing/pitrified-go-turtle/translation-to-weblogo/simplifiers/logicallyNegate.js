import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

const pairs = [
	['==', '!='],
	['>', '<='],
	['<', '>=']
];
const operatorInversionMap = new Map();
for (const [symbol1, symbol2] of pairs) {
	operatorInversionMap.set(symbol1, symbol2);
	operatorInversionMap.set(symbol2, symbol1);
}

export function logicallyNegate(token) {
	if (token.type === ParseTreeTokenType.UNARY_OPERATOR &&
	token.val === '!') {
		token.removeSingleToken(); // removing the ! will negate the value of the expression.
	}
	else if (token.type === ParseTreeTokenType.BOOLEAN_LITERAL) {
		token.val = (token.val === 'true') ? 'false' : 'true';
	}
	else if (token.type === ParseTreeTokenType.BINARY_OPERATOR &&
	operatorInversionMap.has(token.val)) {
		// Changing the operator will negate the expression's value without adding a token.
		token.val = operatorInversionMap.get(token.val);
	}
	else {
		// this will handle every case but we handled a few previou
		const negateOperator = new ParseTreeToken('!', token.lineIndex, token.colIndex, ParseTreeTokenType.UNARY_OPERATOR);
		const parent = token.parentNode;
		parent.replaceChild(token, negateOperator);
		negateOperator.appendChild(token);
	}
};