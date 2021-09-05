import { testDrawers } from './drawers/testDrawers.js';
import { testDrawingsFromCode } from './testDrawingsFromCode.js';
import { testDrawTurtle } from './testDrawTurtle.js';
import { testTurtleDrawState } from './testTurtleDrawState.js';
import { testTurtleDrawStateArcs } from './testTurtleDrawStateArcs.js';
import { testTurtleDrawStateDirectory } from './turtle-draw-state/testTurtleDrawStateDirectory.js';
import { testTurtleDrawStateEllipseArc2 } from './testTurtleDrawStateEllipseArc2.js';
import { testTurtleDrawStateGetLineJoinStyle } from './testTurtleDrawStateGetLineJoinStyle.js';
import { testTurtleDrawStateOrientation } from './testTurtleDrawStateOrientation.js';
import { testVector } from './vector/testVector.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';

export function testDrawing(logger) {
	wrapAndCall([
		testDrawers,
		testDrawingsFromCode,
		testDrawTurtle,
		testTurtleDrawState,
		testTurtleDrawStateArcs,
		testTurtleDrawStateDirectory,
		testTurtleDrawStateEllipseArc2,
		testTurtleDrawStateGetLineJoinStyle,
		testTurtleDrawStateOrientation,
		testVector
	], logger);
};