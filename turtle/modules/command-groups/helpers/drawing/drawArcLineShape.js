/*
Similar to some WebLogo code in the corresponding example.
*/
export function drawArcLineShape(turtle, shape, scale) {
	const oldHeading = turtle.heading();
	const oldPos = turtle.pos();
	turtle.jumpRight(scale * shape[0]);
	turtle.jumpForward(Math.abs(scale) * shape[1]);
	turtle.polyStart();
	turtle.arcLines(shape[2], scale);
	turtle.polyEnd();
	turtle.setHeading(oldHeading);
	turtle.jumpTo(oldPos);
};