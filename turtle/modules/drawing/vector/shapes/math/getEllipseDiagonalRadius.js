export function getEllipseDiagonalRadius(angleRadians, radius1, radius2) {
	radius1 *= radius1;
	radius2 *= radius2;
	const cosAngle = Math.cos(angleRadians);
	const sinAngle = Math.sin(angleRadians);
	const A = radius1 / radius2;
	return Math.sqrt(radius1 / (cosAngle * cosAngle + A * sinAngle * sinAngle));
};