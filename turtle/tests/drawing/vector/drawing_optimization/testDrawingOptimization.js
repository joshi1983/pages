import { testCreateFilledCircleUsingCircleLeft } from './testCreateFilledCircleUsingCircleLeft.js';
import { testGetSimplestShape } from './testGetSimplestShape.js';
import { testHiding } from './hiding/testHiding.js';
import { testMergeArcs } from './testMergeArcs.js';
import { testMergeLines } from './testMergeLines.js';
import { testMergeLineWithArc } from './testMergeLineWithArc.js';
import { testMergeOverlappingParallelLines } from './testMergeOverlappingParallelLines.js';
import { testMergePathWithArc } from './testMergePathWithArc.js';
import { testMergePathWithLine } from './testMergePathWithLine.js';
import { testMergeShapes } from './testMergeShapes.js';
import { testOptimizeClosedPath } from './testOptimizeClosedPath.js';
import { testOptimizeDrawing } from './testOptimizeDrawing.js';
import { testTryMergeShapePairWithTestDrawings } from './testTryMergeShapePairWithTestDrawings.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testDrawingOptimization(logger) {
	wrapAndCall([
		testCreateFilledCircleUsingCircleLeft,
		testGetSimplestShape,
		testHiding,
		testMergeArcs,
		testMergeLines,
		testMergeLineWithArc,
		testMergeOverlappingParallelLines,
		testMergePathWithArc,
		testMergePathWithLine,
		testMergeShapes,
		testOptimizeClosedPath,
		testOptimizeDrawing,
		testTryMergeShapePairWithTestDrawings
	], logger);
};