function compareByVectorZ(p1, p2) {
	return p2.vector.getZ() - p1.vector.getZ();
}

export function sortPointCloudPoints(points) {
	points.sort(compareByVectorZ);
};