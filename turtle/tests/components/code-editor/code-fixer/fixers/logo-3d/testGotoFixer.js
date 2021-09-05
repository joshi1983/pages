import { gotoFixer } from '../../../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/gotoFixer.js';
import { processTestCases } from '../processTestCases.js';

export function testGotoFixer(logger) {
	const cases = [
		{'code': 'print "Define', 'logged': false},
		{'code': 'mark x', 'to': 'make "x pos', 'logged': true},
		{'code': 'omark x', 'to': 'make "x turtleState', 'logged': true},
		{'code': 'omark x goto x', 'to': 'make "x turtleState setTurtleState :x', 'logged': true},
		{'code': 'mark x goto x', 'to': 'make "x pos jumpTo :x', 'logged': true},
	];
	processTestCases(cases, gotoFixer, logger);
};