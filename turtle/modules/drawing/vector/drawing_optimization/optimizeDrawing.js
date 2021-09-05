import { Shape } from '../shapes/Shape.js';
import { tryMergeShapePair } from './tryMergeShapePair.js';
import { Vector2DDrawing } from '../Vector2DDrawing.js';

function removeInvisibleShapes(layer) {
	layer.shapes = layer.shapes.filter(shape => typeof shape.isVisible !== 'function' || shape.isVisible() === true);
}

function optimizeVector2DLayer(layer) {
	removeInvisibleShapes(layer);
	if (layer.shapes.length > 1) {
		const newShapes = [layer.shapes[0]];
		for (let i = 1; i < layer.shapes.length; i++) {
			const result = tryMergeShapePair(newShapes[newShapes.length - 1], layer.shapes[i]);
			if (result instanceof Shape)
				newShapes[newShapes.length - 1] = result;
			else
				newShapes.push(layer.shapes[i]);
		}
		layer.shapes = newShapes;
	}
}

function optimizeVector2DDrawing(drawing2D) {
	optimizeVector2DLayer(drawing2D.foreground);
}

export function optimizeDrawing(drawing) {
	if (drawing instanceof Vector2DDrawing)
		optimizeVector2DDrawing(drawing);
};