import { unassignedVariableDenoiser } from '../../../../modules/parsing/parse-tree-analysis/denoising/unassignedVariableDenoiser.js';
import { processDenoiseTestCases } from './processDenoiseTestCases.js';

export function testUnassignedVariableDenoiser(logger) {
	const cases = [
		{'code': 'fd :x', 'removeCount': 0},
		{'code': 'to p\nfd :x\nend', 'removeCount': 0},
		{'code': 'to p :x\nend\np :y', 'removeCount': 0},
		{'code': 'to p :x\nend\np :x', 'removeCount': 0}
	];
	// FIXME: find code cases that actually remove messages.
	// The cases above are added only to show code that doesn't lead to message removal.
	// If no case exists, we should remove unassignedVariableDenoiser and this test.
	processDenoiseTestCases(cases, unassignedVariableDenoiser, logger);
};