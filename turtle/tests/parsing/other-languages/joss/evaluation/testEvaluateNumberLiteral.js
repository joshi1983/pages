import { evaluateNumberLiteral } from
'../../../../../modules/parsing/other-languages/joss/evaluation/evaluateNumberLiteral.js';
import { ParseTreeToken } from
'../../../../../modules/parsing/generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../../modules/parsing/other-languages/joss/ParseTreeTokenType.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

function wrappedEvaluateNumberLiteral(val) {
	const token = new ParseTreeToken(val, 0, 0, ParseTreeTokenType.NUMBER_LITERAL);
	return evaluateNumberLiteral(token);
}

export function testEvaluateNumberLiteral(logger) {
	const cases = [
		{'in': '-3', 'out': -3},
		{'in': '3', 'out': 3},
		{'in': '1.5', 'out': 1.5},
	];
	testInOutPairs(cases, wrappedEvaluateNumberLiteral, logger);
};