import { createTestTurtle } from
'../../helpers/createTestTurtle.js';
import { orientationTowards } from
'../../../modules/command-groups/helpers/orientationTowards.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

function wrappedOrientationTowards(offset) {
	const turtle = createTestTurtle();
	turtle.jumpTo([0, 0, 0]);
	return orientationTowards(turtle, offset);
}

export function testOrientationTowards(logger) {
	const cases = [
	{'in': [0, 0, 0], 'out': [[1, 0, 0], [0, 1, 0], [0, 0, 1]]},
	];
	testInOutPairs(cases, wrappedOrientationTowards, logger);
};