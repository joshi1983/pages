import { isCompleteTemplateLiteral } from
'../../../../modules/parsing/js-parsing/scanning/isCompleteTemplateLiteral.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsCompleteTemplateLiteral(logger) {
	const cases = [
		{'in': '`', 'out': false},
		{'in': '``', 'out': true},
		{'in': '`hi', 'out': false},
		{'in': '`hi`', 'out': true},
		{'in': '`hello', 'out': false},
		{'in': '`hello world`', 'out': true},
		{'in': '`hello\\`', 'out': false},
		{'in': '`hello\\``', 'out': true},
	];
	testInOutPairs(cases, isCompleteTemplateLiteral, logger);
};