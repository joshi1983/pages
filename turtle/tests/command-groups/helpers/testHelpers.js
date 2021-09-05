import { testDistanceToLine } from './testDistanceToLine.js';
import { testFactorial } from './testFactorial.js';
import { testIo } from './io/testIo.js';
import { testIsotoxalStar } from './testIsotoxalStar.js';
import { testLinePointDistance } from './testLinePointDistance.js';
import { testMix } from './testMix.js';
import { testMixColourish } from './testMixColourish.js';
import { testNChooseK } from './testNChooseK.js';
import { testPlainDataToWebLogoDataStructure } from './testPlainDataToWebLogoDataStructure.js';
import { testSolveQuartic } from './testSolveQuartic.js';
import { testSolveCubic } from './testSolveCubic.js';
import { testStripes } from './testStripes.js';
import { testTriLengthsToRadianAngle } from './testTriLengthsToRadianAngle.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testHelpers(logger) {
	wrapAndCall([
		testDistanceToLine,
		testFactorial,
		testIo,
		testIsotoxalStar,
		testLinePointDistance,
		testMix,
		testMixColourish,
		testNChooseK,
		testPlainDataToWebLogoDataStructure,
		testSolveQuartic,
		testSolveCubic,
		testStripes,
		testTriLengthsToRadianAngle
	], logger);
};