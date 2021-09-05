import { evaluateCharacterLiteral } from
'../../../../modules/parsing/pitrified-go-turtle/evaluation/evaluateCharacterLiteral.js';
import { ParseTreeToken } from
'../../../../modules/parsing/generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

function wrappedEvaluateCharacterLiteral(val) {
	const token = new ParseTreeToken(val, 0, 0, ParseTreeTokenType.CHARACTER_LITERAL);
	return evaluateCharacterLiteral(token);
}

export function testEvaluateCharacterLiteral(logger) {
	const cases = [
		{'in': "'x'", 'out': 'x'},
		{'in': "'y'", 'out': 'y'},
		{'in': "'Y'", 'out': 'Y'},
		{'in': "'3'", 'out': '3'}
	];
	testInOutPairs(cases, wrappedEvaluateCharacterLiteral, logger);
};