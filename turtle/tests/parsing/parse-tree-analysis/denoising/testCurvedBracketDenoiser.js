import { curvedBracketDenoiser } from '../../../../modules/parsing/parse-tree-analysis/denoising/curvedBracketDenoiser.js';
import { processDenoiseTestCases } from './processDenoiseTestCases.js';

export function testCurvedBracketDenoiser(logger) {
	const cases = [
		{'code': 'print (5 + 4', 'removeCount': 0},
		{'code': 'repeat 2 [print (3 +])', 'removeCount': 0},
	];
	// FIXME: find code cases that actually remove messages.
	// The cases above are added only to show code that doesn't lead to message removal.
	// If no case exists, we should remove curvedBracketDenoiser and this test.
	processDenoiseTestCases(cases, curvedBracketDenoiser, logger);
};