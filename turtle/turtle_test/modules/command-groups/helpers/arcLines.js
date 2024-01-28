/*
This is similar to the following WebLogo code:

to myArcLines :arcLinesInfo :scale
	localmake "sign sign :scale
	localmake "scale abs :scale
	repeat count :arcLinesInfo [
		localmake "arcLineInfo item repcount :arcLinesInfo
		ifelse 1 = count :arcLineInfo [
			forward :scale * first :arcLineInfo
		] [
			localmake "arcRadius :scale * last :arcLineInfo
			ifelse :arcRadius = 0 [
				left :sign * first :arcLineInfo
			] [
				arcLeft :sign * first :arcLineInfo :arcRadius
			]
		]
	]
end
*/
export function arcLines(turtle, arcLinesInfo, scale) {
	const sign = Math.sign(scale);
	scale = Math.abs(scale);
	for (let i = 0; i < arcLinesInfo.length; i++) {
		const arcLineInfo = arcLinesInfo[i];
		if (arcLineInfo.length === 1)
			turtle.forward(scale * arcLineInfo[0]);
		else {
			const arcRadius = scale * arcLineInfo[1];
			if (arcRadius === 0)
				turtle.left(sign * arcLineInfo[0]);
			else
				turtle.arcLeft(sign * arcLineInfo[0], arcRadius);
		}
	}
};