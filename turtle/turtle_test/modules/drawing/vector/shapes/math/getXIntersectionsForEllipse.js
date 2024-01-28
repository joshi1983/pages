import { MathCommands } from '../../../../command-groups/MathCommands.js';

const mathCommands = new MathCommands();

// assumes the ellipse is not rotated in any direction other than heading.
// In other words, this will not work if there is any 3D rotation.
export function getXIntersectionsForEllipse(ellipseShape, y) {
	y -= ellipseShape.position.getY();
	const cosA = Math.cos(ellipseShape.rotationRadians);
	const sinA = Math.sin(ellipseShape.rotationRadians);
	const cosASqr = cosA * cosA;
	const sinASqr = sinA * sinA;
	const radius1Sqr = ellipseShape.radius1 * ellipseShape.radius1;
	const radius2Sqr = ellipseShape.radius2 * ellipseShape.radius2;
	const a = cosASqr / radius1Sqr + sinASqr / radius2Sqr;
	const b = 2 * y * sinA * cosA * (1/radius1Sqr - 1/radius2Sqr);
	const c = y * y * (sinASqr / radius1Sqr + cosASqr / radius2Sqr) - 1;
	const results = mathCommands.solveQuadratic(a, b, c);
	return results.map(function(val) {
		return val - ellipseShape.position.getX();
	});
}