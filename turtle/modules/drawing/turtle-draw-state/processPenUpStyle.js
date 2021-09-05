export function processPenUpStyle(turtleState, shape) {
	if (turtleState.isPenDown === false)
		shape.style.setPenWidth(0);
	return shape;
};