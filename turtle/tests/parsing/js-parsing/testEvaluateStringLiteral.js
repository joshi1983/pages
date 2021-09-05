import { evaluateStringLiteral } from '../../../modules/parsing/js-parsing/evaluateStringLiteral.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

export function testEvaluateStringLiteral(logger) {
	const cases = [
		{'in': '"hi"'},
		{'in': "'hi'"},
		{'in': '"hi\\"world"'},
		{'in': '"hi\\\\\\"world"'},
	];
	cases.forEach(function(caseInfo) {
		caseInfo.out = eval(caseInfo.in);
		// eval is simple and correct but a more secure implementation is in the unit under test 
		// in case malicious JavaScript makes its way into the function call.
	});
	testInOutPairs(cases, evaluateStringLiteral, logger);
};