import { test360DegreeArcs } from './test360DegreeArcs.js';
/*import { testAnimation } from './animation/testAnimation.js';
import { testBoundingBox } from './testBoundingBox.js';
import { testBoundingBox2D } from './testBoundingBox2D.js';
import { testCamera } from './testCamera.js';
import { testDrawingBoundingBox } from './testDrawingBoundingBox.js';
import { testDrawingOptimization } from './drawing_optimization/testDrawingOptimization.js';
import { testEasing } from './easing/testEasing.js';
import { testMatrix3D } from './testMatrix3D.js';
import { testMatrixMultiplyInPlace3By3 } from './testMatrixMultiplyInPlace3By3.js';
import { testModel3D } from './testModel3D.js';
import { testOrientation2D } from './testOrientation2D.js';
import { testOrientation3D } from './testOrientation3D.js';
import { testOrientation3DAdvanced } from './testOrientation3DAdvanced.js';
import { testOrientationRotated } from './testOrientationRotated.js';
*/import { testShapes } from './shapes/testShapes.js';
/*import { testVector2D } from './testVector2D.js';
import { testVector2DLayer } from './testVector2DLayer.js';
import { testVector2DQuadTree } from './testVector2DQuadTree.js';
import { testVector3D } from './testVector3D.js';
import { testVectorDrawing } from './testVectorDrawing.js';*/
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testVector(logger) {
	wrapAndCall([
		test360DegreeArcs,
		/*test3DDrawing,
		testAnimation,
		testBoundingBox,
		testBoundingBox2D,
		testCamera,
		testDrawingBoundingBox,
		testDrawingOptimization,
		testEasing,
		testMatrix3D,
		testMatrixMultiplyInPlace3By3,
		testModel3D,
		testOrientation2D,
		testOrientation3D,
		testOrientation3DAdvanced,
		testOrientationRotated,
		*/testShapes,
		/*testVector2D,
		testVector2DLayer,
		testVector2DQuadTree,
		testVector3D,
		testVectorDrawing
*/
	], logger);
};