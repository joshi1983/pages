import { Vector2DDrawing } from '../../../vector/Vector2DDrawing.js';

function getEqualGradient(gradient, gradients) {
	for (let i = 0; i < gradients.length; i++) {
		if (gradients[i].equals(gradient))
			return gradients[i];
	}
}

function mergeEqualGradients(gradients, shapes) {
	shapes.forEach(function(shape) {
		const style = shape.style;
		const penGradient = style.getPenGradient();
		if (penGradient !== undefined)
			shape.style.setPenGradient(getEqualGradient(penGradient, gradients), true);
		const fillGradient = style.getFillGradient();
		if (fillGradient !== undefined)
			shape.style.setFillGradient(getEqualGradient(fillGradient, gradients), true);
	});
}

export function optimizeGradientReferences(drawing) {
	let shapes = drawing.getShapesArray();
	let gradients = [];
	shapes.forEach(function(shape) {
		const style = shape.style;
		if (style.getPenGradient() !== undefined)
			gradients.push(style.getPenGradient());
		if (style.getFillGradient() !== undefined)
			gradients.push(style.getFillGradient());
	});
	// if there are no gradients or just 1, make no changes.
	if (gradients.length <= 1)
		return drawing;
	const newGradients = [];
	gradients.forEach(function(gradient) {
		const equalGradient = getEqualGradient(gradient, newGradients);
		if (equalGradient === undefined) {
			gradient.getId();
			newGradients.push(gradient);
		}
	});
	// if all gradients are distinct, return as is.
	if (newGradients.length === gradients.length)
		return drawing;
	gradients = newGradients;
	// clone all the shapes so there is no risk of mutating the source data.
	shapes = shapes.map(shape => shape.clone());
	// look for gradients that are equal.
	mergeEqualGradients(gradients, shapes);
	const result = new Vector2DDrawing(drawing);
	result.foreground.clear();
	result.addForegroundShapes(shapes, false);
	return result;
};