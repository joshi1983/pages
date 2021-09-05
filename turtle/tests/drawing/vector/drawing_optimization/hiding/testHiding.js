import { testAreAllColourStopsOpaque } from './testAreAllColourStopsOpaque.js';
import { testIsCircleHidingCircle } from './testIsCircleHidingCircle.js';
import { testIsFillOpaque } from './testIsFillOpaque.js';
import { testIsPathHidingArc } from './testIsPathHidingArc.js';
import { testIsPathHidingCircle } from './testIsPathHidingCircle.js';
import { testIsPathHidingLine } from './testIsPathHidingLine.js';
import { testIsPathHidingPath } from './testIsPathHidingPath.js';
import { testIsPenOpaque } from './testIsPenOpaque.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testHiding(logger) {
	wrapAndCall([
		testAreAllColourStopsOpaque,
		testIsCircleHidingCircle,
		testIsFillOpaque,
		testIsPathHidingArc,
		testIsPathHidingCircle,
		testIsPathHidingLine,
		testIsPathHidingPath,
		testIsPenOpaque
	], logger);
};