import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testArcToLineSegments } from './testArcToLineSegments.js';
import { testCircleToLineSegments } from './testCircleToLineSegments.js';
import { testEllipseArcToLineSegments } from './testEllipseArcToLineSegments.js';
import { testEllipseToLineSegments } from './testEllipseToLineSegments.js';
import { testPathToLineSegments } from './testPathToLineSegments.js';

export function testWire(logger) {
	testArcToLineSegments(prefixWrapper('testArcToLineSegments', logger));
	testCircleToLineSegments(prefixWrapper('testCircleToLineSegments', logger));
	testEllipseArcToLineSegments(prefixWrapper('testEllipseArcToLineSegments', logger));
	testEllipseToLineSegments(prefixWrapper('testEllipseToLineSegments', logger));
	testPathToLineSegments(prefixWrapper('testPathToLineSegments', logger));
};