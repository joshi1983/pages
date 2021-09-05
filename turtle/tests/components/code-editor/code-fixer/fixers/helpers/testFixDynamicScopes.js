import { fixDynamicScopes } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/fixDynamicScopes.js';
import { processTestCases } from '../processTestCases.js';

export function testFixDynamicScopes(logger) {
	const cases = [
		{'code': 'make "x 5', 'logged': false},
		{'code': 'print :x', 'logged': false},
		{'code': 'to p\nend', 'logged': false},
		{'code': 'to p\nlocalmake "x 4\nprint :x\nend', 'logged': false},
		{'code': 'to p\nlocal "x\nprint :x\nend\nmake "x 5', 'logged': false},
		{'code': 'to p\nprint :x\nend\nto q\nlocalmake "x 3\np\nend',
		'to': 'to p\n:x print :x\nend\nto q\nlocalmake "x 3\np\n:x end', 'logged': true},
		{'code': 'to p\nprint :x\nend\nto p2\nlocalmake "x 5\np\nend',
		'to': 'to p\n:x print :x\nend\nto p2\nlocalmake "x 5\np\n:x end', 'logged': true},
		{'code': 'to p\nprint :x\nend\nto p2\np\nend\nto q\nlocalmake "x 5\np2\nend',
		'to': 'to p\n:x print :x\nend\nto p2\n\n:x p :x end\nto q\nlocalmake "x 5\np2\n:x end', 'logged': true},
		{'code': 'to p\nprint :x\nend\nto q\nlocalmake "x 5\np\nend\np',
		'to': 'to p\n:x print :x\nend\nto q\nlocalmake "x 5\np\n:x end\np', 'logged': true, 'ignoreParseErrors': true},
		// Leave the global call to p without the :x parameter since adding it will only
		//turn one problem into another.  There is no global x variable so it'll be unassigned anyway.
		//ignoreParseErrors is true because we expect a parse error since the global p call was given no parameter.
		{'code': 'to p :x\nprint :y\nend\nto q\nlocalmake "y 5\np 2\nend\np 3',
		'to': 'to p :x\n:y print :y\nend\nto q\nlocalmake "y 5\np 2\n:y end\np 3', 'logged': true, 'ignoreParseErrors': true},
		{
		'code': 'to p\nprint :x\nprint :y\nend\nto q\nlocalmake "x 1\nlocalmake "y 2\np\nend',
		'to': 'to p\n:x :y print :x\nprint :y\nend\nto q\nlocalmake "x 1\nlocalmake "y 2\np\n:x :y end',
		'logged': true
		},
		{
			'code': `to drawShape :size
	localmake "oldState turtleState
	localmake "gap : localmakw "squareSize :size - :gap
	localmake "numSides 32
	localmake "center pos
	repeat :numSides [
		jumpForward :gap
		jumpTo :center
		rollRight 360 / :numSides
	]
	setTurtleState :oldState
end`, 'logged': false
		},
	];
	processTestCases(cases, fixDynamicScopes, logger);
};