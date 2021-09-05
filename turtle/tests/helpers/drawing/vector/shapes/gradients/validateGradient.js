import { AlphaColour } from '../../../../../../modules/AlphaColour.js';
import { Colour } from '../../../../../../modules/Colour.js';
import { EasingFunction } from '../../../../../../modules/drawing/vector/easing/EasingFunction.js';
import { GradientStopPoint } from '../../../../../../modules/drawing/vector/shapes/gradients/GradientStopPoint.js';
import { prefixWrapper } from '../../../../prefixWrapper.js';
import { Transparent } from '../../../../../../modules/Transparent.js';
await AlphaColour.asyncInit();
await Colour.asyncInit();

function validateColorStops(colorStops, logger) {
	if (!(colorStops instanceof Map)) {
		logger(`Map expected but got ${colorStops}`);
		return false;
	}
	for (const [ratio, stopPointInfo] in colorStops.entries()) {
		if (!isNumber(ratio)) {
			logger(`Every key expected to be a ratio number.  Something other than a number found in "${ratio}"`);
			return false;
		}
		if (ratio < 0 || ratio > 1) {
			logger(`Every ratio expected to be between 0 and 1 but found ${ratio}`);
			return false;
		}
		if (!(stopPointInfo instanceof GradientStopPoint)) {
			logger(`Every value in the colorStops expected to be a GradientStopPoint but found ${stopPointInfo}`);
			return false;
		}
		const colour = stopPointInfo.colour;
		if (colour !== Transparent && !(colour instanceof Colour) && !(colour instanceof AlphaColour)) {
			logger(`Every GradientStopPoint's colour should be Transparent, a Colour, or AlphaColour but found: ${colour}`);
			return false;
		}
		const easing = stopPointInfo.easing;
		if (!(easing instanceof EasingFunction)) {
			logger(`Every GradientStopPoint's easing should be an EasingFunction but found: ${easing}`);
			return false;
		}
	}
	return true;
}

export function validateGradient(gradient, logger) {
	if (!validateColorStops(gradient.colorStops, prefixWrapper('validateColorStops', logger)))
		return false;

	return true; // indicate all checks found no problem.
};