export function arcsRight(turtle, arcsInfo, scale) {
	for (let i = 0; i < arcsInfo.length; i++) {
		const arcInfo = arcsInfo[i];
		if (arcInfo[1] === 0)
			turtle.right(arcInfo[0]);
		else
			turtle.arcLeft(-arcInfo[0], scale * arcInfo[1]);
	}
};