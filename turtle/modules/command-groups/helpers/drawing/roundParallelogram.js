/*
to roundParallelogram :width :slantedHeight :angle :cornerRadius
	localmake "oldState turtleState
	localmake "angle2 90 + :angle
	localmake "angle3 90 - :angle
	if :slantedHeight < 0 [
		localmake "slantedHeight -:slantedHeight
		right 180
	]
	localmake "straightHeight :slantedHeight - :cornerRadius * 2 / cos :angle
	localmake "straightWidth1 :width / 2 - :cornerRadius * tan :angle2 / 2
	localmake "straightWidth2 :width / 2 - :cornerRadius  * tan :angle3 / 2
	polyStart
	left 90
	jumpForward :straightWidth1
 	arcLeft -:angle2 :cornerRadius
	jumpForward :straightHeight
	arcLeft -:angle3 :cornerRadius
	jumpForward :straightWidth1 + :straightWidth2
 	arcLeft -:angle2 :cornerRadius
	jumpForward :straightHeight
 	arcLeft -:angle3 :cornerRadius
	polyEnd

	setTurtleState :oldState
end
*/
export function roundParallelogram(turtle, width, slantedHeight, angle, cornerRadius) {
	const oldPos = turtle.pos();
	const oldHeading = turtle.heading();
	const angle2 = 90 + angle;
	const angle3 = 90 - angle;
	if (slantedHeight < 0) {
		slantedHeight = -slantedHeight;
		turtle.right(180);
	}
	const straightHeight = slantedHeight - cornerRadius * 2 / Math.cos(angle * Math.PI / 180);
	const straightWidth1 = width / 2 - cornerRadius * Math.tan(angle2 / 2 * Math.PI / 180);
	const straightWidth2 = width / 2 - cornerRadius * Math.tan(angle3 / 2 * Math.PI / 180);
	turtle.polyStart();
	turtle.left(90);
	turtle.jumpForward(straightWidth1);
	turtle.arcLeft(-angle2, cornerRadius);
	turtle.jumpForward(straightHeight);
	turtle.arcLeft(-angle3, cornerRadius);
	turtle.jumpForward(straightWidth1 + straightWidth2);
	turtle.arcLeft(-angle2, cornerRadius);	
	turtle.jumpForward(straightHeight);
	turtle.arcLeft(-angle3, cornerRadius);
	turtle.polyEnd();

	turtle.jumpTo(oldPos);
	turtle.setHeading(oldHeading);
};