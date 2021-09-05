import { testColorToContext2DExpression } from './testColorToContext2DExpression.js';
import { testColorToSVGOpacityExpression } from './testColorToSVGOpacityExpression.js';
import { testColorToSVGStopColor } from './testColorToSVGStopColor.js';
import { testGetNumCyclesForShapeAndGradient } from './testGetNumCyclesForShapeAndGradient.js';
import { testGradient } from './testGradient.js';
import { testGradientStopPoint } from './testGradientStopPoint.js';
import { testLinearGradient } from './testLinearGradient.js';
import { testRadialGradient } from './testRadialGradient.js';
import { testSanitizeColorStopValue } from './testSanitizeColorStopValue.js';
import { testSpreadMethod } from './testSpreadMethod.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testGradients(logger) {
	wrapAndCall([
		testColorToContext2DExpression,
		testColorToSVGOpacityExpression,
		testColorToSVGStopColor,
		testGetNumCyclesForShapeAndGradient,
		testGradient,
		testGradientStopPoint,
		testLinearGradient,
		testRadialGradient,
		testSanitizeColorStopValue,
		testSpreadMethod
	], logger);
};