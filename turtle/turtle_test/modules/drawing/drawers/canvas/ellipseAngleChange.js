export function ellipseAngleChange(a, radiusRatio) {
	const x = Math.cos(a);
	const y = Math.sin(a);
	return Math.atan2(y, x / radiusRatio);
};