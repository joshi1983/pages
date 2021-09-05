import { operatorMessageDenoiser } from '../../../../modules/parsing/parse-tree-analysis/denoising/operatorMessageDenoiser.js';
import { processDenoiseTestCases } from './processDenoiseTestCases.js';

export function testOperatorMessageDenoiser(logger) {
	const cases = [
		{'code': 'print 4 * "hi', 'removeCount': 1}
	];
	processDenoiseTestCases(cases, operatorMessageDenoiser, logger);
};