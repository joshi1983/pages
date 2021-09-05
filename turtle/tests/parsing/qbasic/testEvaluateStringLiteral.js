import { evaluateStringLiteral } from
'../../../modules/parsing/qbasic/evaluateStringLiteral.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

export function testEvaluateStringLiteral(logger) {
	const cases = [
	{'in': '"hi"', 'out': 'hi'},
	{'in': '"hi', 'out': 'hi'},
	{'in': '"hi world"', 'out': 'hi world'},
	];
	testInOutPairs(cases, evaluateStringLiteral, logger);
};