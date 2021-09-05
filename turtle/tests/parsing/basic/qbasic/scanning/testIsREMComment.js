import { isREMComment } from
'../../../../../modules/parsing/basic/qbasic/scanning/isREMComment.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testIsREMComment(logger) {
	const cases = [
		{'in': '123', 'out': false},
		{'in': '"123"', 'out': false},
		{'in': 'true', 'out': false},
		{'in': 'end', 'out': false},
		{'in': 'r', 'out': false},
		{'in': 're', 'out': false},
		{'in': 'rem', 'out': true},
		{'in': 'rem comment', 'out': true},
		{'in': 'REM comment', 'out': true},
		{'in': 'REM" comment"', 'out': true},
		{'in': 'remember', 'out': false},
	];
	testInOutPairs(cases, isREMComment, logger);
};