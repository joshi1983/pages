import { EasingFunction } from './EasingFunction.js';
import { getBezierXtoYApproximator } from '../../../command-groups/helpers/getBezierXtoYApproximator.js';

/*
Control points are from: https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function
*/
const inOutBezierApproximator = getBezierXtoYApproximator([[0, 0], [0.42, 0.0], [0.58, 1.0], [1, 1]]);

export class EaseInOut extends EasingFunction {
	constructor() {
		super();
	}

	getRatio(ratio) {
		return inOutBezierApproximator(ratio);
	}
};