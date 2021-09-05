import { animationSetupOutputDenoiser } from '../../../../modules/parsing/parse-tree-analysis/denoising/animationSetupOutputDenoiser.js';
import { processDenoiseTestCases } from './processDenoiseTestCases.js';

export function testAnimationSetupOutputDenoiser(logger) {
	const cases = [
	{'code': `to animation.setup
	output penDown
end`, 'removeCount': 1}
	];
	processDenoiseTestCases(cases, animationSetupOutputDenoiser, logger);
};