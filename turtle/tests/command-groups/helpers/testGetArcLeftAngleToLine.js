import { getArcLeftAngleToLine, getCircleCenter } from
'../../../modules/command-groups/helpers/getArcLeftAngleToLine.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';
import { wrapAndCall } from
'../../helpers/wrapAndCall.js';

function testGetCircleCenter(logger) {
	const cases = [
	{'inArgs': [0, [1, 0, 0], 1], 'out': [0, 0]},
	{'inArgs': [0, [2, 0, 0], 1], 'out': [1, 0]},
	{'inArgs': [0, [1, 1, 0], 1], 'out': [0, 1]},
	{'inArgs': [0, [2, 0, 0], 2], 'out': [0, 0]},
	{'inArgs': [Math.PI / 2, [0, 0, 0], 1], 'out': [0, 1],
		'useIsCloseEnough': true, 'tolerance': 0.0001},
	{'inArgs': [Math.PI, [0, 0, 0], 1], 'out': [1, 0],
		'useIsCloseEnough': true, 'tolerance': 0.0001}
	];
	testInOutPairs(cases, getCircleCenter, logger);
}

function testGetArcLeftAngleToLine_(logger) {
	const cases = [
	{'inArgs': [0, [1, 0, 0], 1, [0, 0], [0, 1]], 'out': 90},
	{'inArgs': [Math.PI / 2, [0, 0, 0], 1, [1, 1], [0, 1]], 'out': 90},
	{'inArgs': [0, [100, 0, 0], 1, [0, 0], [0, 1]], 'out': -1},
	];
	testInOutPairs(cases, getArcLeftAngleToLine, logger);
}

function testNotMutatingCallerArrays(logger) {
	const inArgs = [0, [1, 0, 0, 0, 0, 0], 1, [0, 0, 0, 0, 0], [0, 1, 0]];
	getArcLeftAngleToLine(...inArgs);
	const expectedLengths = [
		[1, 6], [3, 5], [4, 3]
	];
	for (const [index, expectedLength] of expectedLengths) {
		if (inArgs[index].length !== expectedLength)
			logger(`Expected length to be ${expectedLength} but found ${inArgs[index].length}`);
	}
}

export function testGetArcLeftAngleToLine(logger) {
	wrapAndCall([
		testGetArcLeftAngleToLine_,
		testGetCircleCenter,
		testNotMutatingCallerArrays
	], logger);
};