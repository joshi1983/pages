import { arrayBracketDenoiser } from
'../../../../modules/parsing/parse-tree-analysis/denoising/arrayBracketDenoiser.js';
import { processDenoiseTestCases } from './processDenoiseTestCases.js';

export function testArrayBracketDenoiser(logger) {
	const cases = [
		{'code': `print '{}'`, 'removeCount': 0},
		{'code': `print []`, 'removeCount': 0},
		{'code': '5', 'removeCount': 0},
		{'code': `print {1 2}`, 'removeCount': 6},
	];
	processDenoiseTestCases(cases, arrayBracketDenoiser, logger);
};