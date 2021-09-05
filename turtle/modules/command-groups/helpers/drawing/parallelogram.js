/*
to myParallelogram :width :slantedHeight :angle
	localmake "oldState turtleState
	localmake "oldHeading heading
	jumpLeft :width / 2
	polyStart
	jumpRight :width
	right :angle
	jumpForward :slantedHeight
	setHeading :oldHeading
	jumpLeft :width
	polyEnd
	setTurtleState :oldState
end
*/
export function parallelogram(turtle, width, slantedHeight, angleDegrees) {
	const oldHeading = turtle.heading();
	const oldPos = turtle.pos();
	turtle.jumpLeft(width / 2);
	turtle.polyStart();
	turtle.jumpRight(width);
	turtle.right(angleDegrees);
	turtle.jumpForward(slantedHeight);
	turtle.setHeading(oldHeading);
	turtle.jumpLeft(width);
	turtle.polyEnd();
	turtle.jumpTo(oldPos);
	turtle.setHeading(oldHeading);
};