import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { testColorToContext2DExpression } from './testColorToContext2DExpression.js';
import { testColorToSVGOpacityExpression } from './testColorToSVGOpacityExpression.js';
import { testColorToSVGStopColor } from './testColorToSVGStopColor.js';
import { testLinearGradient } from './testLinearGradient.js';
import { testRadialGradient } from './testRadialGradient.js';
import { testSpreadMethod } from './testSpreadMethod.js';

export function testGradients(logger) {
	testColorToContext2DExpression(prefixWrapper('testColorToContext2DExpression', logger));
	testColorToSVGOpacityExpression(prefixWrapper('testColorToSVGOpacityExpression', logger));
	testColorToSVGStopColor(prefixWrapper('testColorToSVGStopColor', logger));
	testLinearGradient(prefixWrapper('testLinearGradient', logger));
	testRadialGradient(prefixWrapper('testRadialGradient', logger));
	testSpreadMethod(prefixWrapper('testSpreadMethod', logger));
};