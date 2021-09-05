import { invalidVariableNameDenoiser } from '../../../../modules/parsing/parse-tree-analysis/denoising/invalidVariableNameDenoiser.js';
import { processDenoiseTestCases } from './processDenoiseTestCases.js';

export function testInvalidVariableNameDenoiser(logger) {
	const cases = [
		{'code': `make "5hfd 5`, 'removeCount': 0},
		{'code': `make "5hfd penDown`, 'removeCount': 2},
		{'code': `print :0.23`, 'removeCount': 1},
	];
	processDenoiseTestCases(cases, invalidVariableNameDenoiser, logger);
};