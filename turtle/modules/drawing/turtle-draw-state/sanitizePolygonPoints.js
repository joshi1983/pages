import { isNumber } from '../../isNumber.js';
import { Vector3D } from '../vector/Vector3D.js';

export function sanitizePolygonPoints(points) {
	const result = [];
	for (const p of points) {
		const point = p.slice();
		if (point.length > 3)
			throw new Error(`polygon command given a point with a length of ${point.length} when only 2 or 3 numbers should be specified.`);
		for (let i = 0; i < point.length; i++) {
			if (!isNumber(point[i]))
				point[i] = 0;
		}
		while (point.length < 3)
			point.push(0);
		result.push(new Vector3D(point));
	}
	return result;
}