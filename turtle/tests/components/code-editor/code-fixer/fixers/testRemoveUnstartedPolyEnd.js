import { processTestCases } from './processTestCases.js';
import { removeUnstartedPolyEndFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/removeUnstartedPolyEndFixer.js';

export function testRemoveUnstartedPolyEnd(logger) {
	const cases = [
	{'code': '', 'logged': false},
	{'code': 'polyStart\npolyEnd', 'logged': false},
	{'code': 'to p\npolyStart\npolyEnd\nend', 'logged': false},
	{'code': 'to p\npolyStart\nend\np\npolyEnd', 'logged': false},
	{'code': 'to p\npolyEnd\nend\npolyStart\np', 'logged': false},
	{'code': 'polyEnd', 'to': '', 'logged': true},
	{'code': 'polyStart\npolyEnd\npolyEnd', 'to': 'polyStart\npolyEnd\n', 'logged': true},
	];
	processTestCases(cases, removeUnstartedPolyEndFixer, logger);
};