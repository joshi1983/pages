import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { testDrawers } from './drawers/testDrawers.js';
import { testDrawTurtle } from './testDrawTurtle.js';
import { testTurtleDrawState } from './testTurtleDrawState.js';
import { testTurtleDrawStateArcs } from './testTurtleDrawStateArcs.js';
import { testTurtleDrawStateDirectory } from './turtle-draw-state/testTurtleDrawStateDirectory.js';
import { testTurtleDrawStateEllipseArc2 } from './testTurtleDrawStateEllipseArc2.js';
import { testTurtleDrawStateGetLineJoinStyle } from './testTurtleDrawStateGetLineJoinStyle.js';
import { testTurtleDrawStateOrientation } from './testTurtleDrawStateOrientation.js';
import { testVector } from './vector/testVector.js';

export function testDrawing(logger) {
	testDrawers(prefixWrapper('testDrawers', logger));
	testDrawTurtle(prefixWrapper('testDrawTurtle', logger));
	testTurtleDrawState(prefixWrapper('testTurtleDrawState', logger));
	testTurtleDrawStateArcs(prefixWrapper('testTurtleDrawStateArcs', logger));
	testTurtleDrawStateDirectory(prefixWrapper('testTurtleDrawStateDirectory', logger));
	testTurtleDrawStateEllipseArc2(prefixWrapper('testTurtleDrawStateEllipseArc2', logger));
	testTurtleDrawStateGetLineJoinStyle(prefixWrapper('testTurtleDrawStateGetLineJoinStyle', logger));
	testTurtleDrawStateOrientation(prefixWrapper('testTurtleDrawStateOrientation', logger));
	testVector(prefixWrapper('testVector', logger));
};