import { evaluateStringLiteral } from
'../../../../modules/parsing/pitrified-go-turtle/evaluation/evaluateStringLiteral.js';
import { ParseTreeToken } from
'../../../../modules/parsing/generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

function wrappedEvaluateStringLiteral(val) {
	const token = new ParseTreeToken(val, 0, 0, ParseTreeTokenType.STRING_LITERAL);
	return evaluateStringLiteral(token);
}

export function testEvaluateStringLiteral(logger) {
	const cases = [
		{'in': '""', 'out': ''},
		{'in': '"x"', 'out': 'x'},
		{'in': '"xy"', 'out': 'xy'}
	];
	testInOutPairs(cases, wrappedEvaluateStringLiteral, logger);
};