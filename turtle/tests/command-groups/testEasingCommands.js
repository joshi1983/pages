import { EasingCommands } from '../../modules/command-groups/EasingCommands.js';
import { EaseInOut } from '../../modules/drawing/vector/easing/EaseInOut.js';
import { EaseLinear } from '../../modules/drawing/vector/easing/EaseLinear.js';
import { EaseSteps } from '../../modules/drawing/vector/easing/EaseSteps.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { StepPosition } from '../../modules/drawing/vector/easing/StepPosition.js';
import { testInOutPairs } from '../helpers/testInOutPairs.js';

const e = new EasingCommands();

function testEaseSteps(logger) {
	const easeSteps = e.easeSteps(2, StepPosition.JumpEnd);
	if (!(easeSteps instanceof EaseSteps))
		logger(`Expected an instance of EaseSteps but got ${easeSteps}`);
	else {
		const cases = [
			{'in': 0, 'out': 0},
			{'in': 0.9, 'out': 0.5}
		];
		testInOutPairs(cases, input => easeSteps.getRatio(input), logger);
	}
}

function testInterpolateRatio(logger) {
	const linear = e.easeLinear();
	const ratio = e.interpolateRatio(linear, 0.5);
	if (ratio !== 0.5)
		logger(`Expected result to be 0.5 but got ${ratio}`);
}

function testVariousCommands(logger) {
	const linear = e.easeLinear();
	if (!(linear instanceof EaseLinear))
		logger(`Expected an instance of EaseLinear but got ${linear}`);
	const easeInOut = e.easeInOut();
	if (!(easeInOut instanceof EaseInOut))
		logger(`Expected an instance of EaseInOut but got ${easeInOut}`);
}

export function testEasingCommands(logger) {
	testEaseSteps(prefixWrapper('testEaseSteps', logger));
	testInterpolateRatio(prefixWrapper('testInterpolateRatio', logger));
	testVariousCommands(prefixWrapper('testVariousCommands', logger));
};