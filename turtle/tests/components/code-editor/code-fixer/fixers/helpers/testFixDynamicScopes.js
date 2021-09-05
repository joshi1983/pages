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
		{'code': 'to p\nprint :x\nend',
		'to': 'to p\n:x print :x\nend', 'logged': true},
		{'code': 'to p\nprint :x\nend\nto p2\nlocalmake "x 5\np\nend',
		'to': 'to p\n:x print :x\nend\nto p2\nlocalmake "x 5\np\n:x end', 'logged': true},
		{'code': 'to p\nprint :x\nend\nto p2\np\nend',
		'to': 'to p\n:x print :x\nend\nto p2\n\n:x p :x end', 'logged': true},
		{'code': 'to p\nprint :x\nend\np',
		'to': 'to p\n:x print :x\nend\np', 'logged': true, 'ignoreParseErrors': true},
		/* Leave the global call to p without the :x parameter since adding it will only
		turn one problem into another.  There is no global x variable so it'll be unassigned anyway.
		ignoreParseErrors is true because we expect a parse error since the global p call was given no parameter.
		*/
		{'code': 'to p :x\nprint :y\nend\np 3',
		'to': 'to p :x\n:y print :y\nend\np 3', 'logged': true, 'ignoreParseErrors': true},
		{
		'code': 'to p\nprint :x\nprint :y\nend',
		'to': 'to p\n:x :y print :x\nprint :y\nend',
		'logged': true
		},
	];
	processTestCases(cases, fixDynamicScopes, logger);
};