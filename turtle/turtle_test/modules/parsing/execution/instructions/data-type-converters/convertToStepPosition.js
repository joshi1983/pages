import { StepPosition } from '../../../../drawing/vector/easing/StepPosition.js';

export function convertToStepPosition(val) {
	if (Number.isInteger(val))
		return val;
	return StepPosition.parse(val);
};