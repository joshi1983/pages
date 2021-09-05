import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testDrawingOptimization } from './drawing-optimization/testDrawingOptimization.js';
import { testEncodeUrl } from './testEncodeUrl.js';

export function testSVG(logger) {
	testDrawingOptimization(prefixWrapper('testDrawingOptimization', logger));
	testEncodeUrl(prefixWrapper('testEncodeUrl', logger));
};