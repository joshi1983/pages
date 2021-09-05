// FIXME: check rotation radians.
// If the corresponding rotation is 0,
// There should never be a problem with gradients.
export function hasGradientProblem(path) {
	const style = path.style;
	const fillGradient = style.getFillGradient();
	if (fillGradient !== undefined)
		return true;
	if (style.isPenVisible()) {
		const penGradient = style.getPenGradient();
		if (penGradient !== undefined)
			return true;
	}
	return false;
};