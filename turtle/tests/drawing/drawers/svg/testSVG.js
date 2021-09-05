import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testLineToCircle } from './testLineToCircle.js';
import { testDrawingOptimization } from './drawing-optimization/testDrawingOptimization.js';
import { testEncodeUrl } from './testEncodeUrl.js';

export function testSVG(logger) {
	testLineToCircle(prefixWrapper('testLineToCircle', logger));
	testDrawingOptimization(prefixWrapper('testDrawingOptimization', logger));
	testEncodeUrl(prefixWrapper('testEncodeUrl', logger));
};