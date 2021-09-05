import { testOptimizeDrawing } from './testOptimizeDrawing.js';
import { testOptimizeGradientReferences } from './testOptimizeGradientReferences.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testDrawingOptimization(logger) {
	wrapAndCall([
		testOptimizeDrawing,
		testOptimizeGradientReferences
	], logger);
};