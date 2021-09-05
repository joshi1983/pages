import { CircleShape } from '../../../../../modules/drawing/vector/shapes/CircleShape.js';
import { Colour } from '../../../../../modules/Colour.js';
import { LinearGradient } from '../../../../../modules/drawing/vector/shapes/gradients/LinearGradient.js';
import { optimizeGradientReferences } from '../../../../../modules/drawing/drawers/svg/drawing-optimization/optimizeGradientReferences.js';
import { ShapeStyle } from '../../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { SpreadMethod } from '../../../../../modules/drawing/vector/shapes/gradients/SpreadMethod.js';
import { Vector2DDrawing } from '../../../../../modules/drawing/vector/Vector2DDrawing.js';
import { Vector2D } from '../../../../../modules/drawing/vector/Vector2D.js';
import { Vector3D } from '../../../../../modules/drawing/vector/Vector3D.js';

function getGradients(drawing) {
	const shapes = drawing.getShapesArray();
	const result = [];
	shapes.forEach(function(shape) {
		const gradients = [shape.style.getPenGradient(), shape.style.getFillGradient()].filter(g => g !== undefined);
		gradients.forEach(function(gradient) {
			if (result.indexOf(gradient) === -1)
				result.push(gradient);
		});
	});
	return result;
}

export function testOptimizeGradientReferences(logger) {
	const from = new Vector2D(0, 0);
	const to = new Vector2D(0, 100);
	const spreadMethod = SpreadMethod.Pad;
	const colorStops = new Map([
		[0, new Colour('black')],
		[1, new Colour('white')]
	]);
	const gradient = new LinearGradient(colorStops, from, to, spreadMethod);
	const gradientClone = new LinearGradient(colorStops, from, to, spreadMethod);
	gradient.getId();
	gradientClone.getId();
	gradient.id = 'label-1';
	if (gradient.getId() !== 'label-1')
		logger(`Expected label-1 but got ${gradient.getId()}`);
	gradientClone.id = 'label-2';
	const drawingWithDuplicateGradient = new Vector2DDrawing();
	const style1 = new ShapeStyle();
	style1.setFillGradient(gradient);
	const style2 = new ShapeStyle();
	style2.setFillGradient(gradientClone);
	const shapes = [
		new CircleShape(new Vector3D(0, 0, 0), 100, style1),
		new CircleShape(new Vector3D(100, 0, 0), 50, style2)
	];
	drawingWithDuplicateGradient.addForegroundShapes(shapes);
	if (getGradients(drawingWithDuplicateGradient).length !== 2)
		logger(`Expected to get 2 gradients but got ${getGradients(drawingWithDuplicateGradient).length}`);
	const optimizedDrawing = optimizeGradientReferences(drawingWithDuplicateGradient);
	if (getGradients(optimizedDrawing).length !== 1)
		logger(`Expected to get 1 gradient but got ${getGradients(optimizedDrawing).length} The ids are: [${getGradients(optimizedDrawing).map(g => g.getId()).join(',')}]`);
};