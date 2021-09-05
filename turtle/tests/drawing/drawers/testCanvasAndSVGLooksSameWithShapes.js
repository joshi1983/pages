import { ArcShape } from '../../../modules/drawing/vector/shapes/ArcShape.js';
import { compareCanvasAndSVGFromDrawing } from './compareCanvasAndSVGFromDrawing.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { ShapeStyle } from '../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { Vector2DDrawing } from '../../../modules/drawing/vector/Vector2DDrawing.js';
import { Vector3D } from '../../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

async function compareDrawingShape(shape, threshold, pixelGap, logger) {
	const drawing = new Vector2DDrawing();
	drawing.addForegroundShape(shape);
	await compareCanvasAndSVGFromDrawing(drawing, threshold, pixelGap, logger);
}

async function testArcShape(logger) {
	const cases = [
		{'angle': Math.PI, 'rotationRadians': 0},
		{'angle': -Math.PI, 'rotationRadians': 0},
	];
	cases.forEach(async function(caseInfo, index) {
		const style = new ShapeStyle({
			'pen': {
				'width': 10
			}
		});
		let rotationRadians = caseInfo.rotationRadians === undefined ? 0 : caseInfo.rotationRadians;
		let angleRadians = caseInfo.angle === undefined ? Math.PI / 2 : caseInfo.angle;
		let radius = caseInfo.radius === undefined ? 40 : caseInfo.radius;
		const arcShape = new ArcShape(new Vector3D(0, 0, 0), rotationRadians, radius, angleRadians, style);
		const plogger = prefixWrapper(`Case ${index}`, logger);
		await compareDrawingShape(arcShape, 0.001, 2, plogger);
	});
}

export async function testCanvasAndSVGLooksSameWithShapes(logger) {
	wrapAndCall([
		testArcShape
	], logger);
};