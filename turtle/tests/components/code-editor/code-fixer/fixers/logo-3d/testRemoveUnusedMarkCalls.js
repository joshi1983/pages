import { processTestCases } from '../processTestCases.js';
import { removeUnusedMarkCalls } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/removeUnusedMarkCalls.js';

export function testRemoveUnusedMarkCalls(logger) {
	const cases = [
		{'code': 'print "Define', 'logged': false},
		{'code': 'mark', 'logged': false},
		{'code': 'omark', 'logged': false},
		{'code': 'mark x\ngoto x', 'logged': false},
		{'code': 'omark x\ngoto x', 'logged': false},
		{'code': 'mark x', 'to': ' ', 'logged': true},
		{'code': 'omark x', 'to': ' ', 'logged': true},
	];
	processTestCases(cases, removeUnusedMarkCalls, logger);
};