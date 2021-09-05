import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testMix } from './testMix.js';
import { testMixColourish } from './testMixColourish.js';
import { testSolveQuartic } from './testSolveQuartic.js';
import { testSolveCubic } from './testSolveCubic.js';

export function testHelpers(logger) {
	testMix(prefixWrapper('testMix', logger));
	testMixColourish(prefixWrapper('testMixColourish', logger));
	testSolveQuartic(prefixWrapper('testSolveQuartic', logger));
	testSolveCubic(prefixWrapper('testSolveCubic', logger));
};