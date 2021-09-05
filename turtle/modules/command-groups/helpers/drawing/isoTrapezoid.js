/*
Similar to the WebLogo code:

to isoTrapezoid :startWidth :endWidth :height
	localmake "oldState turtleState
	localmake "oldHeading heading
	localmake "slantedLength hypot [:height (:endWidth - :startWidth) / 2]
	localmake "angle arcTan2 :height (:endWidth - :startWidth) / 2
	jumpRight :startWidth / 2
	polyStart
	jumpLeft :startWidth
	left :angle
	jumpForward :slantedLength
	setHeading :oldHeading
	jumpRight :endWidth
	polyEnd
	setTurtleState :oldState
end
*/
export function isoTrapezoid(turtle, startWidth, endWidth, height) {
	const oldPos = turtle.pos();
	const oldHeading = turtle.heading();
	const slantedLength = Math.hypot(height, (endWidth - startWidth) / 2);
	const angleDegrees = Math.atan2((endWidth - startWidth) / 2, height) * 180 / Math.PI;
	turtle.jumpRight(startWidth / 2);
	turtle.polyStart();
	turtle.jumpLeft(startWidth);
	turtle.left(angleDegrees);
	turtle.jumpForward(slantedLength);
	turtle.setHeading(oldHeading)
	turtle.jumpRight(endWidth);
	turtle.polyEnd();

	// restore previous state
	turtle.jumpTo(oldPos);
};