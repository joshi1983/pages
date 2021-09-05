import { gotoFixer } from '../../../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/gotoFixer.js';
import { processTestCases } from '../processTestCases.js';

export function testGotoFixer(logger) {
	const cases = [
		{'code': 'print "Define', 'logged': false},
		{'code': 'mark x', 'to': 'make "x pos', 'logged': true},
		{'code': 'omark x', 'to': 'make "x turtleState', 'logged': true},
		{'code': 'rpt 3 [omark x] goto x', 'to': 'rpt 3 [make "x turtleState ] setTurtleState :x', 'logged': true},
		{'code': 'omark x goto x', 'to': 'make "x turtleState setTurtleState :x', 'logged': true},
		{'code': 'mark x goto x', 'to': 'make "x pos jumpTo :x', 'logged': true},
		{'code': 'omark 3 goto 3', 'to': 'make "v3 turtleState setTurtleState :v3', 'logged': true},
		{'code': 'mark 2\nomark 3\ngoto 3\ngoto 2',
		'to': `make "v2
pos make "v3
turtleState setTurtleState :v3
jumpTo :v2`, 'logged': true},
	];
	processTestCases(cases, gotoFixer, logger);
};