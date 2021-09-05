function compareByVectorZ(line1, line2) {
	return line2.midPoint.getZ() - line1.midPoint.getZ();
}

export function sortLineSegments(points) {
	points.sort(compareByVectorZ);
};