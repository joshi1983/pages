/*
Similar to some WebLogo code in the corresponding example.
*/
export function drawArcLineShapes(turtle, shapes, scale) {
	const oldHeading = turtle.heading();
	const oldPos = turtle.pos();
	for (let i = 0; i < shapes.length; i++) {
		const shape = shapes[i];
		turtle.jumpRight(scale * shape[0]);
		turtle.jumpForward(scale * shape[1]);
		turtle.polyStart();
		turtle.arcLines(shape[2], scale);
		turtle.polyEnd();
		turtle.setHeading(oldHeading);
		turtle.jumpTo(oldPos);
	}
};