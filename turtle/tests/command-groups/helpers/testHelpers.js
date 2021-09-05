import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testFactorial } from './testFactorial.js';
import { testMix } from './testMix.js';
import { testMixColourish } from './testMixColourish.js';
import { testNChooseK } from './testNChooseK.js';
import { testSolveQuartic } from './testSolveQuartic.js';
import { testSolveCubic } from './testSolveCubic.js';

export function testHelpers(logger) {
	testFactorial(prefixWrapper('testFactorial', logger));
	testMix(prefixWrapper('testMix', logger));
	testMixColourish(prefixWrapper('testMixColourish', logger));
	testNChooseK(prefixWrapper('testNChooseK', logger));
	testSolveQuartic(prefixWrapper('testSolveQuartic', logger));
	testSolveCubic(prefixWrapper('testSolveCubic', logger));
};