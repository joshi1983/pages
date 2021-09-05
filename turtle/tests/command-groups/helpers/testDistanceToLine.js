import { createTestTurtle } from '../../helpers/createTestTurtle.js';
import { distanceToLine } from
	'../../../modules/command-groups/helpers/distanceToLine.js';
import { equalWithinThreshold } from
'../../../modules/equalWithinThreshold.js';

export function testDistanceToLine(logger) {
	const cases = [
		{
			'heading': 0,
			'points': [[0, 10], [10, 0]],
			'result': 10
		},
		{
			'heading': 0,
			'points': [[10, 0], [0, 10]],
			'result': 10
		},
		{
			'heading': 0,
			'points': [[10, 0], [0, -10]],
			'result': -10
		},
		{
			'heading': 0,
			'points': [[0, -10], [10, 0]],
			'result': -10
		},
		{
			'heading': 0,
			'points': [[9, 0], [10, 10]],
			'result': -90
		},
		{
			'heading': 180,
			'points': [[9, 0], [10, 10]],
			'result': 90
		},
	];
	cases.forEach(function(caseInfo, index) {
		const turtle = createTestTurtle();
		turtle.setHeading(caseInfo.heading);
		const result = distanceToLine(turtle, caseInfo.points[0], caseInfo.points[1]);
		if (!equalWithinThreshold(result, caseInfo.result, 0.000001))
			logger(`Expected result to be ${caseInfo.result} but got ${result}`);
	});
};