import { evaluateStringLiteral } from
'../../../../../modules/parsing/other-languages/joss/evaluation/evaluateStringLiteral.js';
import { ParseTreeToken } from
'../../../../../modules/parsing/generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../../modules/parsing/other-languages/joss/ParseTreeTokenType.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

function wrappedEvaluateStringLiteral(val) {
	const token = new ParseTreeToken(val, 0, 0, ParseTreeTokenType.STRING_LITERAL);
	return evaluateStringLiteral(token);
}

export function testEvaluateStringLiteral(logger) {
	const cases = [
		// Some weird case indicating invalid JOSS code 
		// but we still want to handle it these ways.
		{'in': '', 'out': ''},
		{'in': '"', 'out': ''},

		{'in': '""', 'out': ''},
		{'in': '"x"', 'out': 'x'},
		{'in': '"xy"', 'out': 'xy'}
	];
	testInOutPairs(cases, wrappedEvaluateStringLiteral, logger);
};