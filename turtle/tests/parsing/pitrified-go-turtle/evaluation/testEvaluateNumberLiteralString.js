import { evaluateNumberLiteralString } from
'../../../../modules/parsing/pitrified-go-turtle/evaluation/evaluateNumberLiteralString.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { validNumbers } from
'../scanning/testIsCompleteNumberLiteral.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

function testEvaluateAllValidNumbersAsActualNumbers(logger) {
	validNumbers.forEach(function(num, index) {
		const result = evaluateNumberLiteralString(num);
		if (typeof result !== 'number' || isNaN(result)) {
			logger(`Case ${index}, num=${num}, expected to evaluate to an actual number but found ${result}`);
		}
	});
};

function testSpecificOutputs(logger) {
	const cases = [
		{'in': '1', 'out': 1},
		{'in': '1.5', 'out': 1.5},
		{'in': '1_1', 'out': 11},
		{'in': '1.55', 'out': 1.55},
		{'in': '1.5_5', 'out': 1.55},
		{'in': '0.0', 'out': 0},
		{'in': '.0', 'out': 0},
		{'in': '.0e1', 'out': 0},
		{'in': '.0e0', 'out': 0},
		{'in': '0o1', 'out': 1},
		{'in': '0o7', 'out': 7},
		{'in': '0o7.4', 'out': 7.5},
		{'in': '0O1', 'out': 1},
		{'in': '0x1', 'out': 1},
		{'in': '0x1p1', 'out': 16},
		{'in': '0x2p1', 'out': 32},
		{'in': '0x1.8p1', 'out': 24},
		{'in': '0xf', 'out': 15},
		{'in': '0xf.', 'out': 15},
		{'in': '0xf.8', 'out': 15.5},
		{'in': '0XF', 'out': 15},
		{'in': '0X1F', 'out': 31},
		{'in': '1e1', 'out': 10},
		{'in': '0X.8p0', 'out': 0.5},
		{'in': '0X.8p-0', 'out': 0.5},
		{'in': '0Xp0', 'out': 0},
	];
	testInOutPairs(cases, evaluateNumberLiteralString, logger);
}

export function testEvaluateNumberLiteralString(logger) {
	wrapAndCall([
		testEvaluateAllValidNumbersAsActualNumbers,
		testSpecificOutputs
	], logger);
};