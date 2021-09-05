import { processTestCases } from './processTestCases.js';
import { removeUnusedAssignments } from
'../../../../../modules/components/code-editor/code-fixer/fixers/removeUnusedAssignments.js';

export function testRemoveUnusedAssignments(logger) {
	const cases = [
	{'code': '', 'logged': false},
	{'code': 'make "x 0', 'logged': false},
	{'code': `make "y 0
for ["t 0 15] [
	make "x :t
]`, 'logged': false},
	{'code': `to p
	print :x
	output 3
end
make "x 0
while true [
	make "x p
]`, 'logged': false}, // procedure p reads x so the make "x 0 is not safe to remove.
	{'code': `make "y 0
while true [
	make "x :t
]`, 'logged': false},
	{'code': `make "x 0
while z [
	make "x 3
]`, 'logged': false}, // unknown if the loop will ever run so the initial make "x 0 is unsafe to remove.
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
	{'code': `make "x 0
for ["t 0 15] [
	make "x :t
]`, 'to': `  
for ["t 0 15] [
	make "x :t
]`, 'logged': true},
	{'code': `make "x 0
for ["x 0 15] [
]`, 'to': `  
for ["x 0 15] [
]`, 'logged': true},
	{'code': `make "x 0
while true [
	make "x :t
]`, 'to': `  
while true [
	make "x :t
]`, 'logged': true},
	{'code': `to p
	print :x
	output 3
end
to p2
	localmake "x 0
	while true [
		localmake "x p
	]
end`, 'to': `to p
	print :x
	output 3
end
to p2
	  
	while true [
		localmake "x p
	]
end`, 'logged': true
// procedure p reads a global x variable which can't be the same as the local x to p2 so it is safe to remove make "x 0.
},
	];
	processTestCases(cases, removeUnusedAssignments, logger);
};