import { isCompleteArrow } from
'../../../../../modules/parsing/l-systems/0L/scanning/isCompleteArrow.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testIsCompleteArrow(logger) {
	const cases = [
		{'in': '', 'out': false},
		{'in': '-', 'out': false},
		{'in': '-*', 'out': false},
		{'in': '-+', 'out': false},
		{'in': '+', 'out': false},
		{'in': '=', 'out': false},
		{'in': '->', 'out': true},
		{'in': '-->', 'out': true},
		{'in': '--->', 'out': true},
		{'in': '----->', 'out': true}
	];
	testInOutPairs(cases, isCompleteArrow, logger);
};