export function isotoxalStar(turtle, radius1, radius2, numPoints) {
	let oldHeading = turtle.heading();
	let oldPos = turtle.pos();
	if (radius1 < radius2) {
		// swap.
		const temp = radius1;
		radius1 = radius2;
		radius2 = temp;
		turtle.right(180 / numPoints);
	}
	let angle1 = Math.PI / numPoints;
	let len1 = radius2 * Math.sin(angle1);
	let len2 = radius2 * Math.cos(angle1);
	let size1 = Math.hypot(len1, radius1 - len2);
	let angle2 = Math.PI / 2 - Math.acos(len1 / size1);
	let angle3 = Math.PI - 2 * (angle1 + angle2);
	turtle.jumpForward(radius1);
	// convert radians to degrees.
	angle2 *= 180 / Math.PI;
	angle3 *= 180 / Math.PI;
	turtle.polyStart();
	for (let i = 0; i < numPoints; i++) {
		turtle.right(180 - angle2);
		turtle.jumpForward(size1);
		turtle.left(angle3);
		turtle.jumpForward(size1);
		turtle.left(angle2);
	}
	turtle.polyEnd();
	turtle.jumpTo(oldPos);
	turtle.setHeading(oldHeading);
};