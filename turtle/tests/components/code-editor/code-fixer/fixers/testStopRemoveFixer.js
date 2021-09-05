import { processTestCases } from './processTestCases.js';
import { stopRemoveFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/stopRemoveFixer.js';

export function testStopRemoveFixer(logger) {
	const cases = [
		{'code': 'stop', 'logged': false},
		{'code': 'to p\nend', 'logged': false},
		{'code': 'to p\nstop\nsetPenSize 3\nend', 'logged': false},
		{'code': 'to p\ndo.while [stop\nsetPenSize 3] true\nend', 'logged': false},
		{'code': 'to p\nstop\nend', 'to': 'to p\n\nend', 'logged': true},
		{'code': 'to p\nif true [stop]\nend', 'to': 'to p\nif true []\nend', 'logged': true},
		{'code': 'to p\nifelse true [stop] [stop]\nend', 'to': 'to p\nifelse true [] []\nend', 'logged': true},
	];
	processTestCases(cases, stopRemoveFixer, logger);
};