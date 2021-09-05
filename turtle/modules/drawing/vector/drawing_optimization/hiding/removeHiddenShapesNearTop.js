import { isShapeHidingShape } from './isShapeHidingShape.js';

/*
This is most useful when calling the polyEnd command since
many line segments, and arcs might have been drawn before the complete path is added.

removeHiddenShapesNearTop removes a lot of these hidden shapes if the final polygon uses an 
opaque pen.
*/
export function removeHiddenShapesNearTop(shapes) {
	if (shapes.length < 2)
		return;
	const hiderShape = shapes[shapes.length - 1];
	let i = shapes.length - 2;
	for (; i >= 0; i--) {
		const hiddenShape = shapes[i];
		if (!isShapeHidingShape(hiderShape, hiddenShape))
			break;
	}
	shapes[i + 1] = hiderShape;
	shapes.length = i + 2;
};