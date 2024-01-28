import { clamp } from '../../../clamp.js';
import { LineSegmentShape } from '../../vector/shapes/LineSegmentShape.js';
import { Orientation2D } from '../../vector/Orientation2D.js';
import { Vector3D } from '../../vector/Vector3D.js';

export function ellipseArcToLineSegments(ellipseArc) {
	// more than a circle because the shape is less symmetrical.
	const numVertices = clamp(Math.abs(ellipseArc.angle * 4), 3, 14);
	const orientation = new Orientation2D(ellipseArc.rotationRadians);
	const angleScale = ellipseArc.angle / numVertices;
	const result = [];
	let from, to;
	for (let i = 0; i <= numVertices; i++) {
		const a = i * angleScale;
		const dx = ellipseArc.radius1 * Math.cos(a);
		const dy = ellipseArc.radius2 * Math.sin(a);
		let delta = new Vector3D(dx, dy, 0);
		to = ellipseArc.position.plus(orientation.rotate(delta));
		if (from !== undefined) {
			result.push(new LineSegmentShape(from, to, ellipseArc.style.deepClone()));
		}
		from = to;
	}
	return result;
};