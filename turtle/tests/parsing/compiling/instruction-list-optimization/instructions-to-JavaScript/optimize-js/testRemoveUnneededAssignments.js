import { removeUnneededAssignments } from
'../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/removeUnneededAssignments.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

export function testRemoveUnneededAssignments(logger) {
	const cases = [
	{'in': '', 'changed': false},
	{'in': 'x=x + 1;', 'changed': false}, 
	// x=x + 1 is not unneeded.  It does something useful.

	{'in': 'x++;', 'changed': false},// useful
	{'in': 'x.y=x;', 'changed': false}, // useful
	{'in': 'x+=x;', 'changed': false}, // useful.  It doubles the value of x.
	{'in': 'let x=x;', 'changed': false},
	// leave it because it is a declaration.
	{'in': 'var x=x;', 'changed': false},
	// leave it because it is a declaration.
	{'in': 'const x=x;', 'changed': false},
	// leave it because it is a declaration.
	{'in': 'x=x;', 'out': ''}, // not useful so remove.
	];
	testInOutPairs(cases, removeUnneededAssignments, logger);
};