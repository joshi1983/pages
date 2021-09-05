import { processGeneralPRGenerator } from './processGeneralPRGenerator.js';
import { Xoshiro128PRGenerator } from
'../../../../modules/command-groups/helpers/random/Xoshiro128PRGenerator.js';

export function testXoshiro128PRGenerator(logger) {
	const gen = new Xoshiro128PRGenerator();
	processGeneralPRGenerator(gen, logger);
};