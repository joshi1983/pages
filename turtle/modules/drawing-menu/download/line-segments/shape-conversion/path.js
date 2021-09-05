import { ArrayUtils } from '../../../../ArrayUtils.js';
import { coerceToColour } from '../../../../colour/coerceToColour.js';
import { Colour } from '../../../../Colour.js';
import { ColouredLineSegment } from '../ColouredLineSegment.js';
import { shape } from './shape.js';
import { styleToColour } from '../../styleToColour.js';
import { Vector3D } from '../../../../drawing/vector/Vector3D.js';
await Colour.asyncInit();

export function path(path, degreesPerArcDivision) {
	const elements = path.elements;
	const result = [];
	const colour = coerceToColour(styleToColour(path.style));
	for (let i = 1; i < elements.length; i++) {
		const element = elements[i];
		let prev = elements[i - 1];
		if (typeof prev.getEndPoint === 'function')
			prev = prev.getEndPoint();
		if (element instanceof Vector3D) {
			result.push(new ColouredLineSegment(prev, element, new Colour(colour)));
		}
		else
			ArrayUtils.pushAll(result, shape(element, degreesPerArcDivision));
	}
	if (path.isClosed) {
		let startVector = elements[0];
		if (!(startVector instanceof Vector3D))
			startVector = startVector.getStartPoint();
		let endVector = elements[elements.length - 1];
		if (!(endVector instanceof Vector3D))
			endVector = endVector.getEndPoint();
		if (!startVector.equalsCloseEnough(endVector)) {
			result.push(new ColouredLineSegment(endVector, startVector, new Colour(colour)));
		}
	}
	return result;
}