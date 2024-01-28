
// assumes the ellipse is not rotated in any direction other than heading.
// In other words, this will not work if there is any 3D rotation.
export function getXIntersectionMiddleForEllipse(ellipseShape, y) {
	y -= ellipseShape.position.getY();
	const cosA = Math.cos(ellipseShape.rotationRadians);
	const sinA = Math.sin(ellipseShape.rotationRadians);
	const cosASqr = cosA * cosA;
	const sinASqr = sinA * sinA;
	const radius1Sqr = ellipseShape.radius1 * ellipseShape.radius1;
	const radius2Sqr = ellipseShape.radius2 * ellipseShape.radius2;
	const a = cosASqr / radius1Sqr + sinASqr / radius2Sqr;
	const b = 2 * y * sinA * cosA * (1/radius1Sqr - 1/radius2Sqr);
	return b / (a + a) + ellipseShape.position.getX();
}