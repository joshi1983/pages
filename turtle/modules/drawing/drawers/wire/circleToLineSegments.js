import { LineSegmentShape } from '../../vector/shapes/LineSegmentShape.js';
import { Vector3D } from '../../vector/Vector3D.js';

const numVertices = 12;
const angleScale = Math.PI * 2 / numVertices;

export function circleToLineSegments(circleShape) {
	let from, to, result = [];
	for (let i = 0; i <= numVertices; i++) {
		const a = i * angleScale;
		const dx = circleShape.radius * Math.cos(a);
		const dy = circleShape.radius * Math.sin(a);
		to = circleShape.position.plus(new Vector3D(dx, dy, 0));
		if (from !== undefined) {
			result.push(new LineSegmentShape(from, to, circleShape.style.deepClone()));
		}
		from = to;
	}
	return result;
};