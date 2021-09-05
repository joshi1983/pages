import { isComment } from
'../../../../../modules/parsing/basic/qbasic/scanning/isComment.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testIsComment(logger) {
	const cases = [
	{'in': 'remember hello world', 'out': false},
	{'in': 'print rem', 'out': false},
	{'in': 'print rem', 'out': false},
	{'in': 'print REM', 'out': false},
	{'in': 'rem hello world', 'out': true},
	{'in': 'REM hello world', 'out': true},
	];
	testInOutPairs(cases, isComment, logger);
};