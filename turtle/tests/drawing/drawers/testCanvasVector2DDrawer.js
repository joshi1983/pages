import { CircleShape } from '../../../modules/drawing/vector/shapes/CircleShape.js';
import { createTestCanvas2DDrawer } from '../../helpers/createTestCanvas2DDrawer.js';
import { createTestDrawing } from '../../helpers/createTestDrawing.js';
import { createTestPath } from '../../helpers/createTestPath.js';
import { LineSegmentShape } from '../../../modules/drawing/vector/shapes/LineSegmentShape.js'
import { TurtleDrawState } from '../../../modules/drawing/TurtleDrawState.js'
import { Vector3D } from '../../../modules/drawing/vector/Vector3D.js'

function testDrawing(logger) {
	const drawer = createTestCanvas2DDrawer();
	const drawing = createTestDrawing();
	drawing.drawAsSingleLayer(drawer);
	const canvas = document.createElement('canvas');
	drawer.copyToSingleCanvas(canvas);
}

function testWithSomeShapes(logger) {
	const drawer = createTestCanvas2DDrawer();
	drawer.drawCircle(new CircleShape(new Vector3D(1, 2, 0), 10));
	drawer.drawLine(new LineSegmentShape(new Vector3D(2, 3, 0), new Vector3D(4, 5, 0)));
	drawer.drawPath(createTestPath());
}

function testRefreshTurtle(logger) {
	const drawer = createTestCanvas2DDrawer();
	const turtleDrawState = new TurtleDrawState();
	drawer.refreshTurtle(turtleDrawState);
}

export function testCanvasVector2DDrawer(logger) {
	testDrawing(logger);
	testWithSomeShapes(logger);
	testRefreshTurtle(logger);
};