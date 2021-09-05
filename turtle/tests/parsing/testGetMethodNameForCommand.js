import { getMethodNameForCommand } from '../../modules/parsing/getMethodNameForCommand.js';
import { testInOutPairs } from '../helpers/testInOutPairs.js';

export function testGetMethodNameForCommand(logger) {
	const cases = [
		{'in': '.y', 'out': '_y'},
		{'in': 'x.y', 'out': 'x_y'},
		{'in': 'x.y.', 'out': 'x_y_'},
		{'in': 'x.y.z', 'out': 'x_y_z'},
		{'in': 'sorted?', 'out': 'sortedp'},
		{'in': 'createPList', 'out': 'createPList'},
	];
	testInOutPairs(cases, getMethodNameForCommand, logger);
};