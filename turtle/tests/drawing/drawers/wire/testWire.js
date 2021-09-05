import { testArcToLineSegments } from './testArcToLineSegments.js';
import { testCircleToLineSegments } from './testCircleToLineSegments.js';
import { testEllipseArcToLineSegments } from './testEllipseArcToLineSegments.js';
import { testEllipseToLineSegments } from './testEllipseToLineSegments.js';
import { testPathToLineSegments } from './testPathToLineSegments.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testWire(logger) {
	wrapAndCall([
		testArcToLineSegments,
		testCircleToLineSegments,
		testEllipseArcToLineSegments,
		testEllipseToLineSegments,
		testPathToLineSegments
	], logger);
};