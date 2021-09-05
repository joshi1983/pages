import { getBlue } from '../../../../colour/getBlue.js';
import { getDistinctPoints, getPointsIndexMap, pointToKey } from './getDistinctPoints.js';
import { getGreen } from '../../../../colour/getGreen.js';
import { getRed } from '../../../../colour/getRed.js';

function toPLYLine(points, options) {
	return function(lineSegment) {
		const index1 = points.get(pointToKey(lineSegment.point1));
		const index2 = points.get(pointToKey(lineSegment.point2));
		let result = '' + index1 + ' ' + index2;
		if (options.includeColour) {
			const c = lineSegment.colour;
			result += ` ${getRed(c)} ${getGreen(c)} ${getBlue(c)}`;
		}
		return result;
	};
}

export function ply(lineSegments, options) {
	const pointsMap = getDistinctPoints(lineSegments);
	const info = getPointsIndexMap(pointsMap, (p) => `${p.getX()} ${p.getY()} ${p.getZ()}`);
	const points = info.indexMap;
	const pointLines = info.vector3DLines;
	let result = `ply
format ascii 1.0
element vertex ${pointLines.length}
property float x
property float y
property float z
element edge ${lineSegments.length}
property int vertex1
property int vertex2`;
	if (options.includeColour) {
		result += `\nproperty uchar red
property uchar green
property uchar blue`;
	}
	result += '\nend_header\n';
	return result + pointLines.join('\n') + '\n' + lineSegments.map(toPLYLine(points, options)).join('\n');
};