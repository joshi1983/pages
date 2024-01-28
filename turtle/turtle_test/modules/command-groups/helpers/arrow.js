/*
Similar to the following WebLogo code:

to arrow :length :headAngleDegrees :edgeSize
	localmake "oldState turtleState
	localmake "oldHeading heading
	localmake "oldPenSize penSize
	localmake "edgeWidth :oldPenSize + :edgeSize * 2
	localmake "length1 :length - :edgeWidth / 2 / tan :headAngleDegrees
	localmake "headSlantLength :edgeWidth / 2 / sin :headAngleDegrees
	setFillColor penColor
	if penGradient? [
		setFillGradient penGradient
	]
	setPenSize 0
	jumpRight :oldPenSize / 2
	polyStart
	jumpForward :length1
	jumpRight :edgeSize
	left :headAngleDegrees
	jumpForward :headSlantLength
	left 180 - 2 * :headAngleDegrees
	jumpForward :headSlantLength
	setHeading :oldHeading
	jumpRight :edgeSize
	jumpBackward :length1
	polyEnd
	setTurtleState :oldState
	jumpForward :length
end
*/
export function arrow(turtle, length, headAngleDegrees, edgeSize) {
	const headAngleRadians = headAngleDegrees * Math.PI / 180; // convert degrees to radians
	const oldState = turtle.turtleState();
	const oldHeading = turtle.heading();
	const oldPenSize = turtle.penSize();
	const edgeWidth = oldPenSize + edgeSize * 2;
	const length1 = length - edgeWidth / 2 / Math.tan(headAngleRadians);
	const headSlantLength = edgeWidth / 2 / Math.sin(headAngleRadians);
	if (turtle.penGradientp())
		turtle.drawState.setFillGradient(turtle.drawState.getPenGradient());
	else
		turtle.drawState.setFillColor(turtle.drawState.getPenColor());
	turtle.drawState.setPenWidth(0);
	turtle.jumpRight(oldPenSize / 2);
	turtle.polyStart();
	turtle.jumpForward(length1);
	turtle.jumpRight(edgeSize);
	turtle.left(headAngleDegrees);
	turtle.jumpForward(headSlantLength);
	turtle.left(180 - 2 * headAngleDegrees);
	turtle.jumpForward(headSlantLength);
	turtle.setHeading(oldHeading);
	turtle.jumpRight(edgeSize);
	turtle.jumpBackward(length1);
	turtle.polyEnd();
	turtle.setTurtleState(oldState);
	turtle.jumpForward(length);
};