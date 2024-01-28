import { EasingFunction } from './EasingFunction.js';
import { getBezierXtoYApproximator } from '../../../command-groups/helpers/getBezierXtoYApproximator.js';

/*
Control points are from: https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function
*/
const easeBezierApproximator = getBezierXtoYApproximator([[0, 0], [0.25, 0.1], [0.25, 1.0], [1, 1]]);

export class EaseEase extends EasingFunction {
	constructor() {
		super();
	}

	getRatio(ratio) {
		return easeBezierApproximator(ratio);
	}
};