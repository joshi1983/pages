import { Vector2DQuadTree } from '../../../drawing/vector/Vector2DQuadTree.js';

function getIdString(v) {
	return '' + v.getX() + ',' + v.getY();
}

export function sanitizePointsCloserThanThreshold(points, minSeparation) {
	if (!(points instanceof Array))
		throw new Error('points must be an Array.  Not: ' + points);
	if (typeof minSeparation !== 'number' || isNaN(minSeparation))
		throw new Error('minSeparation must be a number.  Not: ' + minSeparation);
	const quadTree = new Vector2DQuadTree(points);
	const result = [];
	const resultIdSetExcluded = new Set();
	const clusteredPoints = [];
	for (let i = 0; i < points.length; i++) {
		const point = points[i];
		const pointId = getIdString(point);
		const pointsWithinMinSeparation = quadTree.getVectorsWithinCircle(point, minSeparation);
		if (!resultIdSetExcluded.has(pointId)) {
			result.push(point);
			for (let j = 0; j < pointsWithinMinSeparation.length; j++) {
				resultIdSetExcluded.add(getIdString(pointsWithinMinSeparation[j]));
			}
		}
	}

	return result;
};