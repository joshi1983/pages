import { isQuotedStringLiteralStart } from '../../../../modules/parsing/css/scanning/isQuotedStringLiteralStart.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsQuotedStringLiteralStart(logger) {
	const cases = [
		{'in': '.', 'out': false},
		{'in': '`', 'out': false},
		{'in': '4', 'out': false},
		{'in': '"', 'out': true},
		{'in': '"hi', 'out': true},
		{'in': '"hi"', 'out': true},
		{'in': '\'', 'out': true},
		{'in': '\'hi', 'out': true},
		{'in': '\'hi\'', 'out': true},
		{'in': '../hello.css', 'out': false}
	];
	testInOutPairs(cases, isQuotedStringLiteralStart, logger);
};