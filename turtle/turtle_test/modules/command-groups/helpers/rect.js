/*
Similar to:
to rect :width :height
	localmake "oldState turtleState
	jumpBackward :height / 2
	jumpRight :width / 2
	polyStart
	repeat 2 [
		jumpForward :height
		jumpLeft :width
		left 180
	]
	polyEnd
	setTurtleState :oldState
end
*/
export function rect(turtle, width, height) {
	const oldPos = turtle.pos();
	const oldHeading = turtle.heading();
	turtle.jumpBackward(height / 2);
	turtle.jumpRight(width / 2);
	turtle.polyStart();
	for (let i = 0; i < 2; i++) {
		turtle.jumpForward(height);
		turtle.jumpLeft(width);
		turtle.left(180);
	}
	turtle.polyEnd();
	turtle.jumpTo(oldPos);
	turtle.setHeading(oldHeading);
};