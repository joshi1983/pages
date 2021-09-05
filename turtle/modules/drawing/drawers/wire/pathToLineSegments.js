import { arcToLineSegments } from './arcToLineSegments.js';
import { ArrayUtils } from '../../../ArrayUtils.js';
import { LineSegmentShape } from '../../vector/shapes/LineSegmentShape.js';
import { Vector3D } from '../../vector/Vector3D.js';

export function pathToLineSegments(path) {
	const result = [];
	let from, to;
	for (let i = 0; i < path.elements.length; i++) {
		to = path.elements[i];
		if (to instanceof Vector3D) {
			if (from !== undefined)
				result.push(new LineSegmentShape(from, to, path.style.deepClone()));
		}
		else {
			ArrayUtils.pushAll(result, arcToLineSegments(to));
			to = to.getEndPoint();
		}
		from = to;
	}
	return result;
};