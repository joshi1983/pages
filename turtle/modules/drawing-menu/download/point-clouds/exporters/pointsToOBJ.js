import { getBlue } from '../../../../colour/getBlue.js';
import { getGreen } from '../../../../colour/getGreen.js';
import { getRed } from '../../../../colour/getRed.js';
import { StringBuffer } from '../../../../StringBuffer.js';

export function pointsToOBJ(points, includeColour) {
	const result = new StringBuffer();
	result.append(`# point cloud\ng points`);
	for (let i = 0; i < points.length; i++) {
		const p = points[i];
		const coords = p.vector.coords;
		result.append('\nv ' + coords[0] + ' ' + coords[1] + ' ' + coords[2]);
		if (includeColour) {
			const c = p.colour;
			result.append(` ${getRed(c) / 255} ${getGreen(c) / 255} ${getBlue(c) / 255}`);
		}
	}
	return result.toString();
};