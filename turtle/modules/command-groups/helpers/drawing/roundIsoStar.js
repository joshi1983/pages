function arcLeft(turtle, angle, radius) {
	if (radius === 0)
		turtle.left(angle);
	else
		turtle.arcLeft(angle, radius);
}

export function roundIsoStar(turtle, radius1, radius2, numPoints, cornerRadius1, cornerRadius2) {
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

	let arcAngle1 = 180 - angle2 * 180 / Math.PI;
	len1 = cornerRadius1 / Math.tan(arcAngle1 * Math.PI / 180);
	if ((size1 + len1) < 0) {
		cornerRadius1 = -size1 * Math.tan(arcAngle1 * Math.PI / 180);
		len1 = -size1;
	}
	size1 += len1;
	len2 = Math.abs(cornerRadius2 * Math.tan( angle3 / 2));
	if (size1 - len2 < 0) {
		cornerRadius2 = size1 / Math.tan(angle3 / 2);
		len2 = size1;
	}
	size1 -= len2;
	radius1 -= cornerRadius1 * ((1 / Math.sin(arcAngle1 * Math.PI / 180)) - 1);

	arcAngle1 = (90 - arcAngle1) * 2;
	turtle.jumpForward(radius1);
	// convert radians to degrees.
	angle2 *= 180 / Math.PI;
	angle3 *= 180 / Math.PI;
	turtle.right(90);
	arcLeft(turtle, arcAngle1 / 2, cornerRadius1);
	turtle.penUp();
	turtle.polyStart();
	for (let i = 0; i < numPoints; i++) {
		turtle.jumpForward(size1);
		arcLeft(turtle, angle3, cornerRadius2);
		turtle.jumpForward(size1);
		arcLeft(turtle, arcAngle1, cornerRadius1);
	}
	turtle.polyEnd();
	turtle.jumpTo(oldPos);
	turtle.setHeading(oldHeading);
};