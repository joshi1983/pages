import { getArcRightAngleToLine } from
'../../../modules/command-groups/helpers/getArcRightAngleToLine.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

export function testGetArcRightAngleToLine(logger) {
	const cases = [
	{'inArgs': [0, [-1, 0, 0], 1, [0, 0], [0, 1]], 'out': 90},
	{'inArgs': [Math.PI / 2, [0, 0, 0], 1, [1, -1], [0, -1]], 'out': 90},
	{'inArgs': [0, [100, 0, 0], 1, [0, 0], [0, 1]], 'out': -1},
	];
	testInOutPairs(cases, getArcRightAngleToLine, logger);
};