import { processTestCases } from './processTestCases.js';
import { removeUnusedAssignments } from
'../../../../../modules/components/code-editor/code-fixer/fixers/removeUnusedAssignments.js';

export function testRemoveUnusedAssignments(logger) {
	const cases = [
	{'code': '', 'logged': false},
	{'code': 'make "x 0', 'logged': false},
	{'code': 'make "x 0\nmake "x 3',
		'to': '  \nmake "x 3',
		'logged': true},
	{'code': 'make "x 0\nmake "x 2\nmake "x 3',
		'to': '  \n  \nmake "x 3',
		'logged': true},
	{'code': 'make "x 0\nto p\nend\nmake "x 3',
		'to': '  \nto p\nend\nmake "x 3',
		'logged': true},
	{'code': 'make "x 0\n(6)\nmake "x 3',
		'to': '  \n(6)\nmake "x 3',
		'logged': true},
	{'code': 'make "x 0\ndo.while [\nmake "x 3\n] true',
		'to': '  \ndo.while [\nmake "x 3\n] true',
		'logged': true},
	];
	processTestCases(cases, removeUnusedAssignments, logger);
};