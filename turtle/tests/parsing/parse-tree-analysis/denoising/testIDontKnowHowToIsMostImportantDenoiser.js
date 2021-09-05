import { iDontKnowHowToIsMostImportantDenoiser } from
'../../../../modules/parsing/parse-tree-analysis/denoising/iDontKnowHowToIsMostImportantDenoiser.js';
import { processDenoiseTestCases } from './processDenoiseTestCases.js';

export function testIDontKnowHowToIsMostImportantDenoiser(logger) {
	const cases = [
		{'code': 'print "hi', 'removeCount': 0},
		{'code': 'make "x 4', 'removeCount': 0},
		{'code': 'printg', 'removeCount': 0},
			// an I Don't know... is expected but none removed because no other messages exist.

		{'code': 'make "x p', 'removeCount': 1}
	];
	processDenoiseTestCases(cases, iDontKnowHowToIsMostImportantDenoiser, logger);
};