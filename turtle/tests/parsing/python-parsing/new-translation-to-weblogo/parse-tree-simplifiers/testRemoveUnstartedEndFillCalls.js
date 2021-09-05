import { processTestCases } from
'./processTestCases.js';
import { removeUnstartedEndFillCalls } from
'../../../../../modules/parsing/python-parsing/new-translation-to-weblogo/parse-tree-simplifiers/removeUnstartedEndFillCalls.js';

export function testRemoveUnstartedEndFillCalls(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'print("hi")', 'changed': false},
		{'code': 'begin_fill()\nend_fill()', 'changed': false},
		{'code': 't.begin_fill()\nt.end_fill()', 'changed': false},
		{'code': 'begin_fill()\nprint("hi")\nend_fill()', 'changed': false},
		{'code': 't.begin_fill()\nprint("hi")\nt.end_fill()', 'changed': false},
		{'code': 'def p():\n\tprint("hi")\n\nbegin_fill()', 'changed': false},
		{'code': 'def p():\n\tend_fill()\n\nbegin_fill()', 'changed': false},
		{'code': 'def p():\n\tend_fill()\n\np()', 'changed': false},
		{'code': 'def p():\n\tt.end_fill()\n\nbegin_fill()', 'changed': false},
		{'code': 'def p():\n\t.tend_fill()\n\np()', 'changed': false},
		{'code': 'def p():\n\tprint("hi")\n\nbegin_fill()', 'changed': false},
		{'code': 'def p():\n\tbegin_fill()\n\np()\nend_fill()',
			'changed': false},
		{'code': 'def p():\n\tt.begin_fill()\n\np()\nt.end_fill()',
			'changed': false},
		{'code': 'm = M()\nm.end_fill(1)', 'changed': false},
			// not removed because the extra argument to end_fill m.end_fill(1) is a strong indicator that
			// the method is unlikely to be the Turtle class's end_fill method.
			// It is likely some other method that happens to share the same name.
			// We want to be very selective about any changes we make so such a sign means we should avoid making the change.

		{'code': 'end_fill()', 'out': ''},
		{'code': 'end_fill()\nt.end_fill()', 'out': ''},
		{'code': 'def p():\n\tend_fill()\n\tt.end_fill()', 'out': 'def p():\n\tend_fill()'},
		{'code': 'def p():\n\tbegin_fill()\n\tend_fill()\n\tt.end_fill()', 'out': 'def p():\n\tbegin_fill()\n\tend_fill()'},
		{'code': 'begin_fill()\nend_fill()\nt.end_fill()', 'out': 'begin_fill()\nend_fill()'},
		{'code': 't.end_fill()', 'out': ''},
		{'code': 'def p():\n\tbegin_fill()\n\tend_fill()\n\np()\nend_fill()',
			'out': 'def p():\n\tbegin_fill()\n\tend_fill()\n\np()'},
		{'code': 'def p():\n\tt.begin_fill()\n\tt.end_fill()\n\np()\nt.end_fill()',
			'out': 'def p():\n\tt.begin_fill()\n\tt.end_fill()\n\np()'},
		{'code': 'def p:\n\tprint("hi")\n\np()\nend_fill()',
			'out': 'def p():\n\tprint("hi")\n\np()'},
		{'code': `def p():
	pass

d.begin_fill()
d.end_fill()
p()
d.end_fill()`, 'out': `def p():
	pass

d.begin_fill()
d.end_fill()
p()`}
	];
	processTestCases(cases, removeUnstartedEndFillCalls, logger);
};