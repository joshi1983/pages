import { getSimplestShape } from './getSimplestShape.js';
import { getSimplestShapeStyle } from './getSimplestShapeStyle.js';
import { Shape } from '../shapes/Shape.js';
import { tryMergeShapePair } from './tryMergeShapePair.js';

function removeInvisibleShapes(layer) {
	layer.shapes = layer.shapes.filter(shape =>
		typeof shape.isVisible !== 'function' || shape.isVisible() === true);
}

function optimizeVector2DLayer(layer) {
	removeInvisibleShapes(layer);
	if (layer.shapes.length !== 0) {
		const newShapes = [getSimplestShape(layer.shapes[0])];
		for (let i = 1; i < layer.shapes.length; i++) {
			const result = tryMergeShapePair(newShapes[newShapes.length - 1], layer.shapes[i]);
			if (result instanceof Shape)
				newShapes[newShapes.length - 1] = result;
			else
				newShapes.push(layer.shapes[i]);
		}
		for (let i = 0; i < newShapes.length; i++) {
			const shape = newShapes[i];
			shape.style = getSimplestShapeStyle(shape, true);
		}
		layer.shapes = newShapes;
	}
}

export function optimizeDrawing(drawing) {
	optimizeVector2DLayer(drawing.foreground);
};