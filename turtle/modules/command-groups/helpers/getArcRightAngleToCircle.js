import { getArcAngle } from './getArcAngle.js';

export function getArcRightAngleToCircle(turtle, arcRadius, circlePosition, circleRadius) {
	const thetaRadians = (turtle.heading() + 90) * Math.PI / 180;
	const arcCenterX = turtle.xCor() + arcRadius * (Math.sin(thetaRadians));
	const arcCenterY = turtle.yCor() + arcRadius * (Math.cos(thetaRadians));
	return getArcAngle(turtle, arcRadius, circlePosition, circleRadius, arcCenterX, arcCenterY);
};