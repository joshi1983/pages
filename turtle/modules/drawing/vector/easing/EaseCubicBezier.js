import { DeepEquality } from '../../../DeepEquality.js';
import { EasingFunction } from './EasingFunction.js';
import { getBezierXtoYApproximator } from '../../../command-groups/helpers/getBezierXtoYApproximator.js';

export class EaseCubicBezier extends EasingFunction {
	constructor(x1, y1, x2, y2) {
		super();
		this.inputs = [x1, y1, x2, y2];
		this.approximator = getBezierXtoYApproximator([[0, 0], [x1, y1], [x2, y2], [1, 1]]);
	}

	equals(other) {
		if (!(other instanceof EaseCubicBezier))
			return false;
		return DeepEquality.equals(this.inputs, other.inputs);
	}

	getRatio(ratio) {
		return this.approximator(ratio);
	}

	toJavaScriptExpression() {
		return `new this.EaseCubicBezier(${this.inputs.join(',')})`;
	}

	toPrintedString() {
		return `easeCubicBezier ${this.inputs.join(' ')}`;
	}
};