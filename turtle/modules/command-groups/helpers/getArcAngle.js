import { triLengthsToRadianAngle } from './triLengthsToRadianAngle.js';

export function getArcAngle(turtle, arcRadius, circlePosition, circleRadius, arcCenterX, arcCenterY) {
	const distanceToCircleCenter = turtle.distance(circlePosition);
	const dx = arcCenterX - circlePosition[0];
	const dy = arcCenterY - circlePosition[1];
	const dc = Math.hypot(dx, dy);
	if (dc + circleRadius <= arcRadius)
		return -1;
	if (dc + arcRadius <= circleRadius)
		return -1;
	if (circleRadius + arcRadius <= dc)
		return -1;
	if (arcRadius + distanceToCircleCenter <= dc)
		return -1;
	if (dc + distanceToCircleCenter <= arcRadius)
		return -1;
	if (dc + arcRadius <= distanceToCircleCenter)
		return -1;
	const angle1 = triLengthsToRadianAngle(arcRadius, dc, distanceToCircleCenter);
	const angleFromIntersectionToCircleCenter = triLengthsToRadianAngle(arcRadius, dc, circleRadius);
	let resultRadians = angle1 - angleFromIntersectionToCircleCenter;
	let delta = turtle.heading() - turtle.towards(circlePosition);
	if (Math.abs(delta) > 180)
		delta = 360 - Math.abs(delta);
	if (Math.abs(delta) > 90) {
		resultRadians = Math.abs(angleFromIntersectionToCircleCenter) - angle1;
		if ((resultRadians > Math.PI) || resultRadians < 0)
			resultRadians = -Math.abs(angleFromIntersectionToCircleCenter) - angle1;
	}
	if (resultRadians < 0) {
		if (circleRadius > distanceToCircleCenter)
			return (angle1 + angleFromIntersectionToCircleCenter) * 180 / Math.PI;
		return resultRadians * 180 / Math.PI + 360;
	}
	return resultRadians * 180 / Math.PI;
};