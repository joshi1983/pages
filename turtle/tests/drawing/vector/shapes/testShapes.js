import { testArcShape } from './testArcShape.js';
import { testCircleShape } from './testCircleShape.js';
import { testCylinderShape } from './testCylinderShape.js';
import { testEllipseShape } from './testEllipseShape.js';
import { testEllipseArcShape } from './testEllipseArcShape.js';
import { testGradients } from './gradients/testGradients.js';
import { testLineSegmentShape } from './testLineSegmentShape.js';
import { testMath } from './math/testMath.js';
import { testMixBlendModes } from './mix-blend-modes/testMixBlendModes.js';
import { testOrientedArcShape } from './testOrientedArcShape.js';
import { testOrientedCircleShape } from './testOrientedCircleShape.js';
import { testPathShape } from './testPathShape.js';
import { testPathShapeWithCurves } from './testPathShapeWithCurves.js';
import { testProceduralRasterRectangleShape } from './testProceduralRasterRectangleShape.js';
import { testProceduralRasterRectangleDirectory } from
	'./procedural-raster-rectangle/testProceduralRasterRectangleDirectory.js';
import { testRasterRectangleShape } from './testRasterRectangleShape.js';
import { testSphereShape } from './testSphereShape.js';
import { testStyle } from './style/testStyle.js';
import { testTextShape } from './testTextShape.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testShapes(logger) {
	wrapAndCall([
		testArcShape,
		testCircleShape,
		testCylinderShape,
		testEllipseArcShape,
		testEllipseShape,
		testGradients,
		testLineSegmentShape,
		testMath,
		testMixBlendModes,
		testOrientedArcShape,
		testOrientedCircleShape,
		testPathShape,
		testPathShapeWithCurves,
		testProceduralRasterRectangleShape,
		testProceduralRasterRectangleDirectory,
		testRasterRectangleShape,
		testSphereShape,
		testStyle,
		testTextShape
	], logger);
};