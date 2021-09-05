import { getDistinctPoints, getPointsIndexMap, pointToKey } from './getDistinctPoints.js';

export function obj(lineSegments, options) {
	const pointsMap = getDistinctPoints(lineSegments);
	const info = getPointsIndexMap(pointsMap, (p) => `v ${p.getX()} ${p.getY()} ${p.getZ()}`);
	const indexMap = info.indexMap;
	const vertexLines = info.vector3DLines;
	const lines = [];
	for (let i = 0; i < lineSegments.length; i++) {
		let lineSegment = lineSegments[i];
		const pointIndex1 = indexMap.get(pointToKey(lineSegment.point1));
		let pointIndex2 = indexMap.get(pointToKey(lineSegment.point2));
		let s = `l ${1 + pointIndex1} ${1 + pointIndex2}`;
		for (let j = i + 1; j < lineSegments.length; j++) {
			const nextLineSegment = lineSegments[j];
			const nextPoint = indexMap.get(pointToKey(nextLineSegment.point1));
			if (nextPoint !== pointIndex2) {
				i = j - 1;
				break;
			}
			const index = indexMap.get(pointToKey(nextLineSegment.point2));
			pointIndex2 = index;
			s += ' ' + (1 + index);
		}
		lines.push(s);
	}
	return '# lines\ng lines\n' + vertexLines.join('\n') + '\n' + lines.join('\n');
};