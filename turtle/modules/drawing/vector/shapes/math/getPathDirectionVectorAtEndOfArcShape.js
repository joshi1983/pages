export function getPathDirectionVectorAtEndOfArcShape(arcShape) {
	const offsetToEnd = arcShape.position.minus(arcShape.getEndPoint());
	const headingToEnd = Math.atan2(offsetToEnd.getY(), offsetToEnd.getX());
	headingToEnd += Math.PI / 2;
	const dx = Math.sin(headingToEnd);
	const dy = Math.cos(headingToEnd);
	return new Vector3D([dx, dy, 0]);
};