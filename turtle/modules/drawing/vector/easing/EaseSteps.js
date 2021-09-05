import { EasingFunction } from './EasingFunction.js';
import { StepPosition } from './StepPosition.js';
import { StringUtils } from '../../../StringUtils.js';

export class EaseSteps extends EasingFunction {
	constructor(numSteps, stepPosition) {
		super();
		this.stepPosition = stepPosition;
		this.numSteps = numSteps;
		if (stepPosition === StepPosition.JumpBoth)
			this.getRatio = this.getRatioJumpBoth;
		else if (stepPosition === StepPosition.JumpNone)
			this.getRatio = this.getRatioJumpNone;
		else if (stepPosition === StepPosition.JumpStart)
			this.getRatio = this.getRatioJumpStart;
		else if (stepPosition === StepPosition.JumpEnd)
			this.getRatio = this.getRatioJumpEnd;
		else
			throw new Error(`stepPosition must be an integer but got ${stepPosition}`);
	}

	equals(other) {
		if (!(other instanceof EaseSteps))
			return false;
		return other.numSteps === this.numSteps &&
			other.stepPosition === this.stepPosition;
	}

	getRatioJumpBoth(ratio) {
		return Math.floor(1 + ratio * this.numSteps) / (1 + this.numSteps);
	}

	getRatioJumpEnd(ratio) {
		return Math.floor(ratio * this.numSteps) / this.numSteps;
	}

	getRatioJumpNone(ratio) {
		if (ratio === 1)
			return 1;
		return Math.floor(ratio * this.numSteps) / (this.numSteps - 1);
	}

	getRatioJumpStart(ratio) {
		return Math.ceil(ratio * this.numSteps) / this.numSteps;
	}

	toJavaScriptExpression() {
		return `new this.EaseSteps(${this.numSteps},this.StepPosition.${StepPosition.getNameFor(this.stepPosition)})`;
	}

	toPrintedString() {
		return `easeSteps ${this.numSteps} "${StringUtils.firstCharLower(StepPosition.getNameFor(this.stepPosition))}`;
	}
};