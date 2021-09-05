import { LineSegmentShape } from '../../vector/shapes/LineSegmentShape.js';
import { Orientation2D } from '../../vector/Orientation2D.js';
import { Vector3D } from '../../vector/Vector3D.js';

const numVertices = 12;
const angleScale = Math.PI * 2 / numVertices;

export function ellipseToLineSegments(ellipseShape) {
	let from, to, result = [];
	const orientation = new Orientation2D(ellipseShape.rotationRadians);
	for (let i = 0; i <= numVertices; i++) {
		const a = i * angleScale;
		const dx = ellipseShape.radius1 * Math.cos(a);
		const dy = ellipseShape.radius2 * Math.sin(a);
		const delta = new Vector3D(dx, dy, 0);
		to = ellipseShape.position.plus(orientation.rotate(delta));
		if (from !== undefined) {
			result.push(new LineSegmentShape(from, to, ellipseShape.style.deepClone()));
		}
		from = to;
	}
	return result;
};