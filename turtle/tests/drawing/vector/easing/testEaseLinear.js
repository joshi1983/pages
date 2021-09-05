import { EaseEase } from '../../../../modules/drawing/vector/easing/EaseEase.js';
import { EaseLinear } from '../../../../modules/drawing/vector/easing/EaseLinear.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function testEquals(logger) {
	const linear1 = new EaseLinear();
	const linear2 = new EaseLinear();
	if (linear1.equals(linear2) !== true)
		logger(`Expected to be equal`);
	if (linear1.equals({}) !== false)
		logger(`Expected to not be equal {}`);
	if (linear1.equals(new EaseEase()) !== false)
		logger(`Expected to not be equal EaseEase`);
}

function testGetRatio(logger) {
	const cases = [
		{'in': 0.1, 'out': 0.1},
		{'in': 0.8, 'out': 0.8}
	];
	const linear = new EaseLinear();
	testInOutPairs(cases, linear.getRatio, logger);
}

export function testEaseLinear(logger) {
	wrapAndCall([
		testEquals,
		testGetRatio
	], logger);
};