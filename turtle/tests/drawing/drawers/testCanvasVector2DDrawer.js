import { AlphaColour } from '../../../modules/AlphaColour.js';
import { CircleShape } from '../../../modules/drawing/vector/shapes/CircleShape.js';
import { Colour } from '../../../modules/Colour.js';
import { createTestCanvas2DDrawer } from '../../helpers/createTestCanvas2DDrawer.js';
import { createTestDrawing } from '../../helpers/createTestDrawing.js';
import { createTestDrawingWithCustomEasing } from '../../helpers/createTestDrawingWithCustomEasing.js';
import { createTestPath } from '../../helpers/createTestPath.js';
import { LineSegmentShape } from '../../../modules/drawing/vector/shapes/LineSegmentShape.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { ShapeStyle } from '../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { Transparent } from '../../../modules/Transparent.js'
import { TurtleDrawState } from '../../../modules/drawing/TurtleDrawState.js'
import { Vector3D } from '../../../modules/drawing/vector/Vector3D.js'

function testDrawing(logger) {
	const drawings = [createTestDrawing(), createTestDrawingWithCustomEasing()];
	drawings.forEach(function(drawing) {
		const drawer = createTestCanvas2DDrawer();
		drawing.drawAsSingleLayer(drawer);
		const canvas = document.createElement('canvas');
		drawer.copyToSingleCanvas(canvas);
	});
}

function testWithAlphaColorsAndTransparent(logger) {
	const drawer = createTestCanvas2DDrawer();
	const colors = [Transparent, new AlphaColour("#1234"), new Colour('red')];
	const ctx = drawer.foreground;
	colors.forEach(function(penColor) {
		colors.forEach(function(fillColor) {
			const style = new ShapeStyle();
			style.setPenColor(penColor);
			style.setFillColor(fillColor);
			drawer.setShapeStyle(style, ctx);
		});
	});
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
	testDrawing(prefixWrapper('testDrawing', logger));
	testWithAlphaColorsAndTransparent(prefixWrapper('testWithAlphaColorAndTransparent', logger));
	testWithSomeShapes(prefixWrapper('testWithSomeShapes', logger));
	testRefreshTurtle(prefixWrapper('testRefreshTurtle', logger));
};