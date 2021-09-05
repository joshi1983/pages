import { testCircleToX3D } from './testCircleToX3D.js';
import { testColourToRGBRatios } from './testColourToRGBRatios.js';
import { testCylinderToX3D } from './testCylinderToX3D.js';
import { testShapeStyleToX3D } from './testShapeStyleToX3D.js';
import { testShapeToX3D } from './testShapeToX3D.js';
import { testSphereToX3D } from './testSphereToX3D.js';
import { testTextToX3D } from './testTextToX3D.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testX3D(logger) {
	wrapAndCall([
		testCircleToX3D,
		testColourToRGBRatios,
		testCylinderToX3D,
		testShapeStyleToX3D,
		testShapeToX3D,
		testSphereToX3D,
		testTextToX3D,
	], logger);
};