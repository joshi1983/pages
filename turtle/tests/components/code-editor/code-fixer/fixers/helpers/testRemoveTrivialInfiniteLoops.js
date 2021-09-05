import { processTestCases } from '../processTestCases.js';
import { removeTrivialInfiniteLoops } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/removeTrivialInfiniteLoops.js';

export function testRemoveTrivialInfiniteLoops(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'forever []', 'to': ' ', 'logged': true},
		{'code': 'forever [forward 1 right 1]', 'logged': false}, 
		// not considered trivial because it draws something.
		// The loop isn't clearly only intended as a delay.
		// If that loop is from a translated infinite loop in Python, the Python loop did something other than keep the program running eternally.
	];
	processTestCases(cases, removeTrivialInfiniteLoops, logger);
};