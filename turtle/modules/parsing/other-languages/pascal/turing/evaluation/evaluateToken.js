import { evaluateNumberLiteral } from
'./evaluateNumberLiteral.js';
import { evaluateStringLiteral } from
'./evaluateStringLiteral.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const typeEvalMap = new Map([
	[ParseTreeTokenType.NUMBER_LITERAL, evaluateNumberLiteral],
	[ParseTreeTokenType.STRING_LITERAL, evaluateStringLiteral]
]);

export function evaluateToken(token) {
	const evaluate = typeEvalMap.get(token.type);
	if (evaluate !== undefined)
		return evaluate(token);
};