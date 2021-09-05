import { NativePRGenerator } from
'../../../../modules/command-groups/helpers/random/NativePRGenerator.js';
import { processGeneralPRGenerator } from './processGeneralPRGenerator.js';

export function testNativePRGenerator(logger) {
	const gen = new NativePRGenerator();
	processGeneralPRGenerator(gen, logger);
};