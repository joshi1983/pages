import { compositeFixer } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/compositeFixer.js';
import { logo3DExamples } from '../../../../../helpers/parsing/logo3DExamples.js';
import { processNoJavaScriptErrorsWhileFixing } from
'../processNoJavaScriptErrorsWhileFixing.js';
import { processTestCases } from '../processTestCases.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

function testCompositeFixerInOut(logger) {
	const cases = [
		{'code': 'omark ff\nfd 100\ngoto ff',
		'to': 'make "ff\nturtleState fd 100\nsetTurtleState :ff', 'logged': true},
		{'code': 'omark ff\nfd 100', 'to': ' \nfd 100', 'logged': true},
		{'code': 'mark ff\nfd 100', 'to': ' \nfd 100', 'logged': true},
		{'code': 'repeat 10 [fd -5 lt 90]', 'logged': false},
		{'code': 'fd -d\nlt 90', 'logged': false},
		// d is a leaf but since it isn't declared as a variable, recognized as a command and isn't defined as a procedure.
		// it is left as a leaf because we can't know what it should become.
		{'code': `goto j up 90 fd 
1 dn 90 lt 90 fd 1 rt 90 omark 
j`, 'to': `setTurtleState     
:j pitchUp 90 fd 1 pitchDown 90 lt 90 fd 1 rt 90 make 
"j turtleState`, 'logged': true},

		{'code': '#timeout=250', 'to': '', 'logged': true},
		{'code': 'import x\nfd 100', 'to': ' \nfd 100', 'logged': true},
		{'code': 'dn 90 lt 90', 'to': 'pitchDown 90 lt 90', 'logged': true},
		{'code': 'rpt 10 2[58 [omark k]]', 'to': 'repeat 10 [  ]', 'logged': true},
		{'code': 'to 1\nend', 'to': 'to p1\nend', 'logged': true},
		{'code': 'to 1\nprint "hi\nend', 'to': 'to p1\nprint "hi\nend', 'logged': true},
		{'code': 'to 1\nend\n1', 'to': 'to p1\nend\np1', 'logged': true},
		{'code': 'to 1 :x\nend\n1 2', 'to': 'to p1 :x\nend\np1 2', 'logged': true},
		{'code': 'to 1 :x :y\nend\n1 2 3', 'to': 'to p1 :x :y\nend\np1 2 3', 'logged': true},
		{'code': 'if 4 > 3 [] else []', 'to': 'ifElse 4 > 3 []  []', 'logged': true},
		{'code': 'if 4 gt 3 [] else []', 'to': 'ifElse 4 > 3 []  []', 'logged': true},
		{'code': 'if 4 lt 3 [] else []', 'to': 'ifElse 4 < 3 []  []', 'logged': true},
		{'code': `make d=:dd
rpt 7
[
fd 50
lt 90 pd
make d=d-65
]`, 'to': `make "d
:dd repeat 7
[
fd 50
lt 90 pd
make "d :d-
65]`, 'logged': true, 'ignoreParseErrors': true},
		{'code': `rpt 1
[fd -5 lt 90]`, 'to': `repeat 1
[fd -5 lt 90]`, 'logged': true},
		{'code': 'sc white', 'to': 'setColors "white', 'logged': true}
	];
	processTestCases(cases, compositeFixer, logger);
}

function testNoJavaScriptErrorProcessingLogo3DExamples(logger) {
	processNoJavaScriptErrorsWhileFixing(logo3DExamples, compositeFixer, logger);
}

export function testCompositeFixer(logger) {
	wrapAndCall([
		testCompositeFixerInOut,
		testNoJavaScriptErrorProcessingLogo3DExamples,
	], logger);
};