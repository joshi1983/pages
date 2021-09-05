import { EaseLinear } from '../../easing/EaseLinear.js';
import { GradientStopPoint } from './GradientStopPoint.js';
import { gradientStopPointMapToArray } from './gradientStopPointMapToArray.js';
import { mixColourish } from '../../../../command-groups/helpers/mixColourish.js';

const easeLinear = new EaseLinear();
export function gradientEasingsToEaseLinearColorStops(gradient, easingDivisionFactor) {
	if (easingDivisionFactor === undefined)
		easingDivisionFactor = 10;
	if (gradient.usesOnlyEaseLinear === true || easingDivisionFactor === 0)
		return gradientStopPointMapToArray(gradient.colorStops); // nothing to do.
	else {
		const colorStopArray = gradientStopPointMapToArray(gradient.colorStops);
		const result = [];
		for (let i = 0; i < colorStopArray.length; i++) {
			const pair = colorStopArray[i];
			const ratio = pair[0];
			const value = pair[1];
			if (i !== 0 && !(value.easing instanceof EaseLinear)) {
				const previousPair = colorStopArray[i - 1];
				const ratioStep = (ratio - previousPair[0]) / easingDivisionFactor;
				const easing = value.easing;
				for (let j = 0; j < easingDivisionFactor; j++) {
					const ratio_ = previousPair[0] + ratioStep * (j + 1);
					const mixRatio = easing.getRatio((j + 1) / easingDivisionFactor);
					const colour = mixColourish(value.colour, previousPair[1].colour, mixRatio);
					result.push([ratio_, new GradientStopPoint(colour, easeLinear)]);
				}
				result.push([ratio, new GradientStopPoint(value.colour, easeLinear)]);
			}
			else
				result.push([ratio, value]);
		}
		return result;
	}
};