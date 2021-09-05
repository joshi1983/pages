export function pointToKey(p) {
	return '' + p.getX() + ',' + p.getY() + ',' + p.getZ();
};

function addPointToMap(p, map) {
	const key = pointToKey(p);
	let val = map.get(key);
	if (val === undefined) {
		map.set(key, p);
	}
}

export function getPointsIndexMap(distinctPointsMap, vector3DToString) {
	const points = new Map();
	const pointLines = [];
	let i = 0;
	for (const p of distinctPointsMap.values()) {
		points.set(pointToKey(p), i);
		pointLines.push(vector3DToString(p));
		i++;
	}
	return {'indexMap': points, 'vector3DLines': pointLines};
};

/*
A Map is used to help us find duplicated points efficiently.

*/
export function getDistinctPoints(lineSegments) {
	const points = new Map();
	for (const line of lineSegments) {
		addPointToMap(line.point1, points);
		addPointToMap(line.point2, points);
	}
	return points;
};