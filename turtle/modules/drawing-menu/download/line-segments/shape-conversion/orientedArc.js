import { clamp } from '../../../../clamp.js';
import { coerceToColour } from '../../../../colour/coerceToColour.js';
import { Colour } from '../../../../Colour.js';
import { ColouredLineSegment } from '../ColouredLineSegment.js';
import { styleToColour } from '../../styleToColour.js';
import { Vector3D } from '../../../../drawing/vector/Vector3D.js';
await Colour.asyncInit();

export function orientedArc(arc, degreesPerArcDivision) {
	const colour = coerceToColour(styleToColour(arc.style));
	const numSides = Math.round(clamp(Math.abs(arc.angle) * 180 / Math.PI / degreesPerArcDivision, 2, 360));
	const result = [];
	let prev, first;
	const r = arc.radius;
	const orientationStart = arc.orientation.clone();
	const v = new Vector3D(0, arc.radius, 0);
	for (let i = 0; i <= numSides; i++) {
		const a = i * arc.angle / numSides;
		const newOrientation = orientationStart.clone();
		newOrientation.right(a);
		const newPoint = newOrientation.rotate(v).plus(arc.position);
		if (prev !== undefined) {
			result.push(new ColouredLineSegment(prev, newPoint, new Colour(colour)));
		}
		else
			first = newPoint;
		prev = newPoint;
	}
	return result;

};