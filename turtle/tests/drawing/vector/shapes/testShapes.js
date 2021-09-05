import { testArcShape } from './testArcShape.js';
import { testCircleShape } from './testCircleShape.js';
import { testCylinderShape } from './testCylinderShape.js';
import { testEllipseShape } from './testEllipseShape.js';
import { testEllipseArcShape } from './testEllipseArcShape.js';
import { testGradients } from './gradients/testGradients.js';
import { testLineSegmentShape } from './testLineSegmentShape.js';
import { testMath } from './math/testMath.js';
import { testPathShape } from './testPathShape.js';
import { testPathShapeWithCurves } from './testPathShapeWithCurves.js';
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
		testPathShape,
		testPathShapeWithCurves,
		testRasterRectangleShape,
		testSphereShape,
		testStyle,
		testTextShape
	], logger);
};