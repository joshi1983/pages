/*
Works like this WebLogo code:

to myRoundIsoTriangle :baseWidth :height :cornerRadius
	localmake "oldState turtleState
	localmake "baseAngles arcTan :height / (:baseWidth / 2)
	localmake "baseArcAngle 180 - :baseAngles
	localmake "topAngle 180 - 2 * :baseAngles
	localmake "baseCornerGap :cornerRadius * tan 90 - :baseAngles / 2
	localmake "topCornerGap :cornerRadius * tan 90 - :topAngle / 2
	localmake "baseWidthInner :baseWidth - 2 * :baseCornerGap
	localmake "sideLength1 :height / sin :baseAngles
	localmake "sideLength :sideLength1 - :baseCornerGap - :topCornerGap
	right 90
	jumpForward :baseWidthInner / 2
	polyStart
	arcLeft :baseArcAngle :cornerRadius
	jumpForward :sideLength
	arcLeft 180 - :topAngle :cornerRadius
	jumpForward :sideLength
	arcLeft :baseArcAngle :cornerRadius
	polyEnd
	setTurtleState :oldState
end
*/
export function roundIsoTriangle(turtle, baseWidth, height, cornerRadius) {
	// avoid using turtleState just for small performance benefit.
	const oldHeading = turtle.heading();
	const oldPos = turtle.pos();
	const baseAngleRadians = Math.atan(height / (baseWidth / 2));
	const baseArcAngleDegrees = (Math.PI - baseAngleRadians) * 180 / Math.PI;
	const topAngleRadians = Math.PI - 2 * baseAngleRadians;
	const baseCornerGap = cornerRadius * Math.tan( Math.PI / 2 - baseAngleRadians / 2);
	const topCornerGap = cornerRadius * Math.tan((Math.PI - topAngleRadians) / 2);
	const baseWidthInner = baseWidth - 2 * baseCornerGap;
	const sideLength1 = height / Math.sin(baseAngleRadians);
	const sideLength = sideLength1 - baseCornerGap - topCornerGap;

	turtle.right(90);
	turtle.jumpForward(baseWidthInner / 2);
	turtle.polyStart();
	turtle.arcLeft(baseArcAngleDegrees, cornerRadius);
	turtle.jumpForward(sideLength);
	turtle.arcLeft(180 - topAngleRadians * 180 / Math.PI, cornerRadius);
	turtle.jumpForward(sideLength);
	turtle.arcLeft(baseArcAngleDegrees, cornerRadius);
	turtle.polyEnd();

	// restore old turtle state.
	turtle.setHeading(oldHeading);
	turtle.jumpTo(oldPos);
};