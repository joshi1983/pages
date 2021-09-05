export function getRegularStarSecondRadius(radius, numPoints) {
	if (radius === 0)
		return 0;
	const angle1 = Math.PI / 2 / numPoints;
	const angle2 = angle1 * 2;
	const angle3 = angle2 * 2;
	const separation1 = radius * 2 * Math.sin(angle1);
	const separation2 = radius * Math.sin(angle2);
	const size1 = Math.sqrt(separation1 * separation1 - separation2 * separation2);
	const size2 = separation2 * Math.tan(angle3 - angle2);
	return radius - size1 - size2;
};