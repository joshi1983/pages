import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testLineToCircle } from './testLineToCircle.js';
import { testDrawingOptimization } from './drawing-optimization/testDrawingOptimization.js';
import { testDrawSimpleRect } from './testDrawSimpleRect.js';
import { testEncodeUrl } from './testEncodeUrl.js';
import { testIsRoundedRect } from './testIsRoundedRect.js';
import { testSimpleRect } from './simple-rect/testSimpleRect.js';

export function testSVG(logger) {
	testLineToCircle(prefixWrapper('testLineToCircle', logger));
	testDrawingOptimization(prefixWrapper('testDrawingOptimization', logger));
	testDrawSimpleRect(prefixWrapper('testDrawSimpleRect', logger));
	testEncodeUrl(prefixWrapper('testEncodeUrl', logger));
	testIsRoundedRect(prefixWrapper('testIsRoundedRect', logger));
	testSimpleRect(prefixWrapper('testSimpleRect', logger));
};