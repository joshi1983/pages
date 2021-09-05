import { EaseEase } from '../../../modules/drawing/vector/easing/EaseEase.js';
import { EaseSteps } from '../../../modules/drawing/vector/easing/EaseSteps.js';
import { shouldValueBeCloned } from '../../../modules/parsing/compiling/shouldValueBeCloned.js';
import { StepPosition } from '../../../modules/drawing/vector/easing/StepPosition.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';
import { Transparent } from '../../../modules/Transparent.js';

export function testShouldValueBeCloned(logger) {
	const cases = [
		{'in': 3, 'out': false},
		{'in': "hi", 'out': false},
		{'in': Transparent, 'out': false},
		{'in': [], 'out': true},
		{'in': new Map(), 'out': true},
		{'in': new EaseEase(), 'out': false},
		{'in': new EaseSteps(3, StepPosition.JumpEnd), 'out': false},
	];
	testInOutPairs(cases, shouldValueBeCloned, logger);
};