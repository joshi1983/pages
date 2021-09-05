import { makeQuoteErrorMostImportantForToken } from '../../../../modules/parsing/parse-tree-analysis/denoising/makeQuoteErrorMostImportantForToken.js';
import { processDenoiseTestCases } from './processDenoiseTestCases.js';

export function testMakeQuoteErrorMostImportantForToken(logger) {
	const cases = [
		{'code': 'make :x 4', 'removeCount': 1},
	];
	processDenoiseTestCases(cases, makeQuoteErrorMostImportantForToken, logger);
};