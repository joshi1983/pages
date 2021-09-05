import { testAreAllColourStopsOpaque } from './testAreAllColourStopsOpaque.js';
import { testIsArcHidingArc } from
'./testIsArcHidingArc.js';
import { testIsArcHidingPoint } from
'./testIsArcHidingPoint.js';
import { testIsCircleHidingCircle } from './testIsCircleHidingCircle.js';
import { testIsCircleHidingPoint } from './testIsCircleHidingPoint.js';
import { testIsFillOpaque } from './testIsFillOpaque.js';
import { testIsFillTransparent } from './testIsFillTransparent.js';
import { testIsPathHidingArc } from './testIsPathHidingArc.js';
import { testIsPathHidingCircle } from './testIsPathHidingCircle.js';
import { testIsPathHidingLine } from './testIsPathHidingLine.js';
import { testIsPathHidingPath } from './testIsPathHidingPath.js';
import { testIsPenOpaque } from './testIsPenOpaque.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testHiding(logger) {
	wrapAndCall([
		testAreAllColourStopsOpaque,
		testIsArcHidingArc,
		testIsArcHidingPoint,
		testIsCircleHidingCircle,
		testIsCircleHidingPoint,
		testIsFillOpaque,
		testIsFillTransparent,
		testIsPathHidingArc,
		testIsPathHidingCircle,
		testIsPathHidingLine,
		testIsPathHidingPath,
		testIsPenOpaque
	], logger);
};