import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { testOptimizeDrawing } from './testOptimizeDrawing.js';
import { testOptimizeGradientReferences } from './testOptimizeGradientReferences.js';

export function testDrawingOptimization(logger) {
	testOptimizeDrawing(prefixWrapper('testOptimizeDrawing', logger));
	testOptimizeGradientReferences(prefixWrapper('testOptimizeGradientReferences', logger));
};