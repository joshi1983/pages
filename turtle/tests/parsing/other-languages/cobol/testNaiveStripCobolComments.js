import { naiveStripCobolComments } from
'../../../../modules/parsing/other-languages/cobol/naiveStripCobolComments.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testNaiveStripCobolComments(logger) {
	const cases = [
		{'in': '', 'changed': false},
		{'in': '    identification division.', 'changed': false},
		{'in': '*> a comment', 'out': ''},
	];
	testInOutPairs(cases, naiveStripCobolComments, logger);
};