import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { testDrawers } from './drawers/testDrawers.js';
import { testDrawTurtle } from './testDrawTurtle.js';
import { testTurtleDrawState } from './testTurtleDrawState.js';
import { testTurtleDrawStateArcs } from './testTurtleDrawStateArcs.js';
import { testTurtleDrawStateEllipseArc2 } from './testTurtleDrawStateEllipseArc2.js';
import { testTurtleDrawStateOrientation } from './testTurtleDrawStateOrientation.js';
import { testVector } from './vector/testVector.js';

export function testDrawing(logger) {
	testDrawTurtle(prefixWrapper('testDrawTurtle', logger));
	testDrawers(prefixWrapper('testDrawers', logger));
	testTurtleDrawState(prefixWrapper('testTurtleDrawState', logger));
	testTurtleDrawStateArcs(prefixWrapper('testTurtleDrawStateArcs', logger));
	testTurtleDrawStateEllipseArc2(prefixWrapper('testTurtleDrawStateEllipseArc2', logger));
	testTurtleDrawStateOrientation(prefixWrapper('testTurtleDrawStateOrientation', logger));
	testVector(prefixWrapper('testVector', logger));
};