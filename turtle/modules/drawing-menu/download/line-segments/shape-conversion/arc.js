import { clamp } from '../../../../clamp.js';
import { coerceToColour } from '../../../../colour/coerceToColour.js';
import { Colour } from '../../../../Colour.js';
import { ColouredLineSegment } from '../ColouredLineSegment.js';
import { styleToColour } from '../../styleToColour.js';
import { Vector3D } from '../../../../drawing/vector/Vector3D.js';
await Colour.asyncInit();

export function arc(arc, degreesPerArcDivision) {
	const colour = coerceToColour(styleToColour(arc.style));
	const numSides = Math.round(clamp(Math.abs(arc.angle) * 180 / Math.PI / degreesPerArcDivision, 2, 360));
	const result = [];
	let prev, first;
	const r = arc.radius;
	const startAngle = Math.PI * 1.5 - arc.rotationRadians;
	for (let i = 0; i <= numSides; i++) {
		const a = startAngle - i * arc.angle / numSides;
		const x = arc.position.getX() + r * Math.cos(a);
		const y = arc.position.getY() + r * Math.sin(a);
		const newPoint = new Vector3D(x, y, arc.position.getZ());
		if (prev !== undefined) {
			result.push(new ColouredLineSegment(prev, newPoint, new Colour(colour)));
		}
		else
			first = newPoint;
		prev = newPoint;
	}
	return result;
};