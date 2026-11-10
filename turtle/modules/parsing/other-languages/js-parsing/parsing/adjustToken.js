import { adjustUnaryOperator } from
'../../../generic-parsing-utilities/adjustUnaryOperator.js';
import { getOperatorsAsync } from '../getOperatorsAsync.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export async function asyncInit() {
	const Operators = await getOperatorsAsync();
	const adjusterMap = new Map([
		[ParseTreeTokenType.UNARY_OPERATOR, function(token) {
			adjustUnaryOperator(Operators, ParseTreeTokenType.IDENTIFIER, token);
		}]
	]);
};

export function adjustToken(token) {
	const adjuster = adjusterMap.get(token.type);
	if (adjuster !== undefined)
		return adjuster(token);
	return token;
};