import { stripBASICCommentsAndEmptyStringLiterals } from
'../../../../modules/parsing/basic/helpers/stripBASICCommentsAndEmptyStringLiterals.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testStripBASICCommentsAndEmptyStringLiterals(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'REM hello', 'out': 'REM  '},
		{'in': '\' hello', 'out': '\' '},
		{'in': '1 REM', 'out': '1 REM  '},
		{'in': 'REM hello\nprint "hi"', 'out': 'REM  \nprint "" '},
	];
	testInOutPairs(cases, stripBASICCommentsAndEmptyStringLiterals, logger);
};