import { isCompleteStringLiteral } from '../../../../modules/parsing/js-parsing/scanning/isCompleteStringLiteral.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsCompleteStringLiteral(logger) {
	const cases = [
		{'in': '"', 'out': false},
		{'in': '""', 'out': true},
		{'in': '"hi', 'out': false},
		{'in': '"hi"', 'out': true},
		{'in': '"hello', 'out': false},
		{'in': '\'hello', 'out': false},
		{'in': '"hello world"', 'out': true},
		{'in': '\'hello world\'', 'out': true},
		{'in': '"hello\\"', 'out': false},
		{'in': '"hello\\""', 'out': true},
		{'in': '\'hello\"\'', 'out': true},
		{'in': '"hello\\"\'', 'out': false},
		{'in': '\'hello\\""', 'out': false}
	];
	testInOutPairs(cases, isCompleteStringLiteral, logger);
};