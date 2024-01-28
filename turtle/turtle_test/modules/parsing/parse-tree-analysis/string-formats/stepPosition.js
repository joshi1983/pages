import { StepPosition } from '../../../drawing/vector/easing/StepPosition.js';

export function stepPosition(s) {
	const result = StepPosition.parse(s);
	if (result === undefined)
		return `Unsupported step position "${s}".  The step position must be one of ${StepPosition.getNames().join(',')}`;
};