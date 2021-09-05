import { EaseSteps } from '../../../../modules/drawing/vector/easing/EaseSteps.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { StepPosition } from '../../../../modules/drawing/vector/easing/StepPosition.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

function testEquals(logger) {
	const steps1 = new EaseSteps(3, StepPosition.JumpEnd);
	const steps2 = new EaseSteps(3, StepPosition.JumpStart);
	const steps3 = new EaseSteps(2, StepPosition.JumpEnd);
	if (steps1.equals(steps1) !== true)
		logger(`Expected to be equal`);
	if (steps1.equals({}) !== false)
		logger(`Expected to not be equal {}`);
	if (steps1.equals(steps2) !== false)
		logger(`Expected ${steps1} to not be equal ${steps2}`);
	if (steps1.equals(steps3) !== false)
		logger(`Expected ${steps1} to not be equal ${steps3}`);
}

function testGetRatio(logger) {
	const cases = [
		{'in': 0.1, 'out': 0},
		{'in': 0.49, 'out': 0},
		{'in': 0.51, 'out': 0.5},
		{'in': 0.8, 'out': 0.5}
	];
	const steps = new EaseSteps(2, StepPosition.JumpEnd);
	testInOutPairs(cases, ratio => steps.getRatio(ratio), logger);
}

export function testEaseSteps(logger) {
	testEquals(prefixWrapper('testEquals', logger));
	testGetRatio(prefixWrapper('testGetRatio', logger));
};