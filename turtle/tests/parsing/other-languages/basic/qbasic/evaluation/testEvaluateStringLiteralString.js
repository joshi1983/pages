import { evaluateStringLiteralString } from
'../../../../../../modules/parsing/other-languages/basic/qbasic/evaluation/evaluateStringLiteralString.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

export function testEvaluateStringLiteralString(logger) {
	const cases = [
		{'in': '"hi"', 'out': 'hi'},
		{'in': '"hi', 'out': 'hi'},
		{'in': '"hi world"', 'out': 'hi world'},
	];
	testInOutPairs(cases, evaluateStringLiteralString, logger);
};