import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testFactorial } from './testFactorial.js';
import { testIo } from './io/testIo.js';
import { testMix } from './testMix.js';
import { testMixColourish } from './testMixColourish.js';
import { testNChooseK } from './testNChooseK.js';
import { testPlainDataToWebLogoDataStructure } from './testPlainDataToWebLogoDataStructure.js';
import { testSolveQuartic } from './testSolveQuartic.js';
import { testSolveCubic } from './testSolveCubic.js';
import { testTriLengthsToRadianAngle } from './testTriLengthsToRadianAngle.js';

export function testHelpers(logger) {
	testFactorial(prefixWrapper('testFactorial', logger));
	testIo(prefixWrapper('testIo', logger));
	testMix(prefixWrapper('testMix', logger));
	testMixColourish(prefixWrapper('testMixColourish', logger));
	testNChooseK(prefixWrapper('testNChooseK', logger));
	testPlainDataToWebLogoDataStructure(prefixWrapper('testPlainDataToWebLogoDataStructure', logger));
	testSolveQuartic(prefixWrapper('testSolveQuartic', logger));
	testSolveCubic(prefixWrapper('testSolveCubic', logger));
	testTriLengthsToRadianAngle(prefixWrapper('testTriLengthsToRadianAngle', logger));
};