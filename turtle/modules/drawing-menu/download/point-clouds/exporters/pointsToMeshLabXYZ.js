import { StringBuffer } from '../../../../StringBuffer.js';

export function pointsToMeshLabXYZ(points) {
	const result = new StringBuffer();
	for (let i = 0; i < points.length; i++) {
		const coords = points[i].vector.coords;
		result.append(coords[0] + ' ' + coords[1] + ' ' + coords[2] + '\n');
	}
	return result.toString();
};