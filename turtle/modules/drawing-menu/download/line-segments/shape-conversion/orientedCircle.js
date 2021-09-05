import { clamp } from '../../../../clamp.js';
import { coerceToColour } from '../../../../colour/coerceToColour.js';
import { Colour } from '../../../../Colour.js';
import { ColouredLineSegment } from '../ColouredLineSegment.js';
import { styleToColour } from '../../styleToColour.js';
import { Vector3D } from '../../../../drawing/vector/Vector3D.js';

export function orientedCircle(circle, degreesPerArcDivision) {
	const colour = coerceToColour(styleToColour(circle.style));
	const numSides = Math.round(clamp(360 / degreesPerArcDivision, 4, 360));
	const result = [];
	let prev, first;
	const r = circle.radius;
	for (let i = 0; i < numSides; i++) {
		const a = i * Math.PI * 2 / numSides;
		const x = r * Math.cos(a);
		const y = r * Math.sin(a);
		const newPoint = circle.orientation.rotate(new Vector3D(x, y, 0)).plus(circle.position);
		if (prev !== undefined) {
			result.push(new ColouredLineSegment(prev, newPoint, new Colour(colour)));
		}
		else
			first = newPoint;
		prev = newPoint;
	}
	result.push(new ColouredLineSegment(prev, first, new Colour(colour)));
	return result;
};