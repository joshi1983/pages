import { testLineToCircle } from './testLineToCircle.js';
import { testDrawingOptimization } from './drawing-optimization/testDrawingOptimization.js';
import { testDrawRoundedRect } from './testDrawRoundedRect.js';
import { testDrawSimpleRect } from './testDrawSimpleRect.js';
import { testDrawUTurnRect } from './testDrawUTurnRect.js';
import { testEncodeUrl } from './testEncodeUrl.js';
import { testRoundedRect } from './rounded-rect/testRoundedRect.js';
import { testSimpleRect } from './simple-rect/testSimpleRect.js';
import { testUTurnRect } from './u-turn-rect/testUTurnRect.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testSVG(logger) {
	wrapAndCall([
		testLineToCircle,
		testDrawingOptimization,
		testDrawRoundedRect,
		testDrawSimpleRect,
		testDrawUTurnRect,
		testEncodeUrl,
		testRoundedRect,
		testSimpleRect,
		testUTurnRect,
	], logger);
};