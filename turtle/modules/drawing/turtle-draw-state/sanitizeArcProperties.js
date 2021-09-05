export function sanitizeArcProperties(startAngle, angle) {
	if (angle < 0) {
		startAngle += angle;
		angle = -angle;
	}
	return {
		'startAngle': startAngle,
		'angle': angle
	};
};