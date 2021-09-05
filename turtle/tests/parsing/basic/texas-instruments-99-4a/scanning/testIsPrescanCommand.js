import { isPrescanCommand } from
'../../../../../modules/parsing/basic/texas-instruments-99-4a/scanning/isPrescanCommand.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testIsPrescanCommand(logger) {
	const cases = [
		{'in': '', 'out': false},
		{'in': '!', 'out': false},
		{'in': '!@P', 'out': false},
		{'in': '!@P*', 'out': false},
		{'in': '!@', 'out': false},
		{'in': '!@P+', 'out': true},
		{'in': '!@P-', 'out': true}
	];
	testInOutPairs(cases, isPrescanCommand, logger);
};