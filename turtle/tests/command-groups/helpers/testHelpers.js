import { testDistanceToLine } from './testDistanceToLine.js';
import { testDrawing } from './drawing/testDrawing.js';
import { testFactorial } from './testFactorial.js';
import { testIo } from './io/testIo.js';
import { testLinePointDistance } from './testLinePointDistance.js';
import { testMix } from './testMix.js';
import { testMixColourish } from './testMixColourish.js';
import { testNChooseK } from './testNChooseK.js';
import { testPlainDataToWebLogoDataStructure } from './testPlainDataToWebLogoDataStructure.js';
import { testSolveQuartic } from './testSolveQuartic.js';
import { testSolveCubic } from './testSolveCubic.js';
import { testTriLengthsToRadianAngle } from './testTriLengthsToRadianAngle.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testHelpers(logger) {
	wrapAndCall([
		testDistanceToLine,
		testDrawing,
		testFactorial,
		testIo,
		testLinePointDistance,
		testMix,
		testMixColourish,
		testNChooseK,
		testPlainDataToWebLogoDataStructure,
		testSolveQuartic,
		testSolveCubic,
		testTriLengthsToRadianAngle
	], logger);
};