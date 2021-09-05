import { EaseInOut } from '../../../../modules/drawing/vector/easing/EaseInOut.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testEaseInOut(logger) {
	const cases = [
		{'in': 0, 'out': 0},
		{'in': 1, 'out': 1, 'useIsCloseEnough': true, 'tolerance': 0.0006}
	];
	const easeInOut = new EaseInOut();
	testInOutPairs(cases, easeInOut.getRatio, logger);
};