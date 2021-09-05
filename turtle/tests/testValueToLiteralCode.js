import { testInOutPairs } from './helpers/testInOutPairs.js';
import { valueToLiteralCode } from '../modules/valueToLiteralCode.js';

export function testValueToLiteralCode(logger) {
	const cases = [
		{'in': 'hi', 'out': '"hi'},
		{'in': 'hello world', 'out': '\'hello world\''},
		{'in': 4, 'out': '4'},
		{'in': 4.1, 'out': '4.1'},
		{'in': true, 'out': 'true'},
		{'in': false, 'out': 'false'},
		{'in': [], 'out': '[]'},
		{'in': ['hi'], 'out': '["hi]'},
	];
	testInOutPairs(cases, valueToLiteralCode, logger);
};