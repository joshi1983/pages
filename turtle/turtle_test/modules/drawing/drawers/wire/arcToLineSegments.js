import { clamp } from '../../../clamp.js';
import { LineSegmentShape } from '../../vector/shapes/LineSegmentShape.js';
import { Orientation2D } from '../../vector/Orientation2D.js';
import { Vector3D } from '../../vector/Vector3D.js';

export function arcToLineSegments(arc) {
	const numVertices = clamp(Math.abs(arc.angle * 3), 2, 12);
	const orientation = new Orientation2D(arc.rotationRadians);
	const angleScale = arc.angle / numVertices;
	let from, to, result = [];
	for (let i = 0; i <= numVertices; i++) {
		const a = i * angleScale;
		const dx = arc.radius * Math.cos(a);
		const dy = arc.radius * Math.sin(a);
		const delta = new Vector3D(dx, dy, 0);
		to = arc.position.plus(orientation.rotate(delta));
		if (from !== undefined) {
			result.push(new LineSegmentShape(from, to, arc.style.deepClone()));
		}
		from = to;
	}
	return result;
};