/*
Similar to the following WebLogo code:

to myArcsLeft :arcsInfo :scale
	repeat count :arcsInfo [
		localmake "arcInfo item repcount :arcsInfo
		localmake "arcAngle first :arcInfo
		localmake "arcRadius :scale * last :arcInfo
		ifelse :arcRadius = 0 [
			left :arcAngle
		] [
			arcLeft :arcAngle :arcRadius
		]
	]
end
*/
export function arcsLeft(turtle, arcsInfo, scale) {
	for (let i = 0; i < arcsInfo.length; i++) {
		const arcInfo = arcsInfo[i];
		const arcAngle = arcInfo[0];
		const arcRadius = scale * arcInfo[1];
		if (arcRadius === 0)
			turtle.left(arcAngle);
		else
			turtle.arcLeft(arcAngle, arcRadius);
	}
};