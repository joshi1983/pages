import { evaluateNumberLiteralString } from
'../../../../modules/parsing/kojo/evaluation/evaluateNumberLiteralString.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

function testSpecificOutputs(logger) {
	const cases = [
		{'in': '1', 'out': 1},
		{'in': '1.5', 'out': 1.5},
		{'in': '23', 'out': 23},
		{'in': '-23', 'out': -23},
		{'in': '013', 'out': 11}, // octal
		{'in': '-013', 'out': -11}, // octal
		{'in': '0x11', 'out': 17}, // hexadecimal
		{'in': '-0x11', 'out': -17} // hexadecimal
	];
	testInOutPairs(cases, evaluateNumberLiteralString, logger);
}

export function testEvaluateNumberLiteralString(logger) {
	wrapAndCall([
		testSpecificOutputs
	], logger);
};