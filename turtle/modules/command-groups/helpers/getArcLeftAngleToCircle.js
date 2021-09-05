import { getArcAngle } from './getArcAngle.js';

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
	const thetaRadians = (turtle.heading() - 90) * Math.PI / 180;
	const arcCenterX = turtle.xCor() + arcRadius * (Math.sin(thetaRadians));
	const arcCenterY = turtle.yCor() + arcRadius * (Math.cos(thetaRadians));
	return getArcAngle(turtle, arcRadius, circlePosition, circleRadius, arcCenterX, arcCenterY);
};