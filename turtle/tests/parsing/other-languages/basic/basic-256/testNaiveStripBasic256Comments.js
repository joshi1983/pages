import { naiveStripBasic256Comments } from
'../../../../../modules/parsing/other-languages/basic/basic-256/naiveStripBasic256Comments.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testNaiveStripBasic256Comments(logger) {
	const cases = [
		{'in': '', 'changed': false},
		{'in': 'print "not a comment"', 'changed': false},
		{'in': 'remember "not a comment"', 'changed': false}, // the 'rem' here is not indicating a comment.
		{'in': 'print "hi"\nprint "bye"', 'changed': false},
		{'in': '# a comment', 'out': ''},
		{'in': 'REM a comment', 'out': ''},
		{'in': 'print "hi"# a comment', 'out': 'print "hi"'},
		{'in': 'print "hi" REM a comment', 'out': 'print "hi" '}
	];
	testInOutPairs(cases, naiveStripBasic256Comments, logger);
};