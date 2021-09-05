import { test360DegreeArcs } from './test360DegreeArcs.js';
import { test3DDrawing } from './test3DDrawing.js';
import { testAnimation } from './animation/testAnimation.js';
import { testBoundingBox } from './testBoundingBox.js';
import { testBoundingBox2D } from './testBoundingBox2D.js';
import { testCamera } from './testCamera.js';
import { testDrawingBoundingBox } from './testDrawingBoundingBox.js';
import { testDrawingOptimization } from './drawing_optimization/testDrawingOptimization.js';
import { testEasing } from './easing/testEasing.js';
import { testMatrix3D } from './testMatrix3D.js';
import { testModel3D } from './testModel3D.js';
import { testOrientation } from './testOrientation.js';
import { testOrientation2D } from './testOrientation2D.js';
import { testOrientationRotated } from './testOrientationRotated.js';
import { testShapes } from './shapes/testShapes.js';
import { testVector2D } from './testVector2D.js';
import { testVector2DDrawing } from './testVector2DDrawing.js';
import { testVector2DLayer } from './testVector2DLayer.js';
import { testVector2DQuadTree } from './testVector2DQuadTree.js';
import { testVector3D } from './testVector3D.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testVector(logger) {
	wrapAndCall([
		test360DegreeArcs,
		test3DDrawing,
		testAnimation,
		testBoundingBox,
		testBoundingBox2D,
		testCamera,
		testDrawingBoundingBox,
		testDrawingOptimization,
		testEasing,
		testMatrix3D,
		testModel3D,
		testOrientation,
		testOrientation2D,
		testOrientationRotated,
		testShapes,
		testVector2D,
		testVector2DDrawing,
		testVector2DLayer,
		testVector2DQuadTree,
		testVector3D
	], logger);
};