import { testLineToCircle } from './testLineToCircle.js';
import { testDrawingOptimization } from './drawing-optimization/testDrawingOptimization.js';
import { testDrawRoundedRect } from './testDrawRoundedRect.js';
import { testDrawSimpleRect } from './testDrawSimpleRect.js';
import { testEncodeUrl } from './testEncodeUrl.js';
import { testRoundedRect } from './rounded-rect/testRoundedRect.js';
import { testSimpleRect } from './simple-rect/testSimpleRect.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testSVG(logger) {
	wrapAndCall([
		testLineToCircle,
		testDrawingOptimization,
		testDrawRoundedRect,
		testDrawSimpleRect,
		testEncodeUrl,
		testRoundedRect,
		testSimpleRect,
	], logger);
};