import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testLineToCircle } from './testLineToCircle.js';
import { testDrawingOptimization } from './drawing-optimization/testDrawingOptimization.js';
import { testDrawRoundedRect } from './testDrawRoundedRect.js';
import { testDrawSimpleRect } from './testDrawSimpleRect.js';
import { testEncodeUrl } from './testEncodeUrl.js';
import { testRoundedRect } from './rounded-rect/testRoundedRect.js';
import { testSimpleRect } from './simple-rect/testSimpleRect.js';

export function testSVG(logger) {
	testLineToCircle(prefixWrapper('testLineToCircle', logger));
	testDrawingOptimization(prefixWrapper('testDrawingOptimization', logger));
	testDrawRoundedRect(prefixWrapper('testDrawRoundedRect', logger));
	testDrawSimpleRect(prefixWrapper('testDrawSimpleRect', logger));
	testEncodeUrl(prefixWrapper('testEncodeUrl', logger));
	testRoundedRect(prefixWrapper('testRoundedRect', logger));
	testSimpleRect(prefixWrapper('testSimpleRect', logger));
};