import { testNativePRGenerator } from './testNativePRGenerator.js';
import { testXoshiro128PRGenerator } from './testXoshiro128PRGenerator.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testRandom(logger) {
	wrapAndCall([
		testNativePRGenerator,
		testXoshiro128PRGenerator
	], logger);
};