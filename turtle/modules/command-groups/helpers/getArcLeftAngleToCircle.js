import { triLengthsToRadianAngle } from './triLengthsToRadianAngle.js';

/*
This is similar to the following WebLogo code:

to getArcLeftAngleToCircle :arcRadius :circlePosition :circleRadius
	localmake "distanceToCircleCenter distance :circlePosition
	localmake "theta heading - 90
	localmake "arcCenterX xCor + :arcRadius * (sin :theta)
	localmake "arcCenterY yCor + :arcRadius * (cos :theta)
	localmake "dx :arcCenterX - first :circlePosition
	localmake "dy :arcCenterY - item 2 :circlePosition
	localmake "dc hypot [:dx :dy]
	if :dc + :circleRadius <= :arcRadius [
		output -1
	]
	if :dc + :arcRadius <= :circleRadius [
		output -1
	]
	if :circleRadius + :arcRadius <= :dc [
		output -1
	]
	if :arcRadius + :distanceToCircleCenter <= :dc [
		output -1
	]
	if :dc + :distanceToCircleCenter <= :arcRadius [
		output -1
	]
	if :dc + :arcRadius <= :distanceToCircleCenter [
		output -1
	]
	localmake "angle1 triLengthsToAngle :arcRadius :dc :distanceToCircleCenter
	localmake "angleFromIntersectionToCircleCenter triLengthsToAngle :arcRadius :dc :circleRadius 
	if :angleFromIntersectionToCircleCenter < 0 [
		output -1
	]
	localmake "result :angle1 - :angleFromIntersectionToCircleCenter
	localmake "delta heading - towards :circlePosition
	if (abs :delta) > 180 [
		localmake "delta 360 - abs :delta
	] 
	if (abs :delta) > 90 [
		localmake "result (abs :angleFromIntersectionToCircleCenter) - :angle1
		if or (:result > 180) :result < 0 [
			localmake "result -(abs :angleFromIntersectionToCircleCenter) - :angle1
		]
	]
	if :result < 0 [
		if :circleRadius > :distanceToCircleCenter [
			output :angle1 + :angleFromIntersectionToCircleCenter
		]
		output :result + 360
	]
	output :result
end*/

export function getArcLeftAngleToCircle(turtle, arcRadius, circlePosition, circleRadius) {
	const distanceToCircleCenter = turtle.distance(circlePosition);
	const thetaRadians = (turtle.heading() - 90) * Math.PI / 180;
	const arcCenterX = turtle.xCor() + arcRadius * (Math.sin(thetaRadians));
	const arcCenterY = turtle.yCor() + arcRadius * (Math.cos(thetaRadians));
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