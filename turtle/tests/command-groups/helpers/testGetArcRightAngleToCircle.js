import { getArcRightAngleToCircle } from '../../../modules/command-groups/helpers/getArcRightAngleToCircle.js';
import { processArcAngleToCircleTests } from './processArcAngleToCircleTests.js';

export function testGetArcRightAngleToCircle(logger) {
	const cases = [
	{'heading': 0, 'position': [0, 0], 'arcRadius': 5, 
		'circleRadius': 100, 'circlePosition': [0, 0], 'out': -1},
	{'heading': 0, 'position': [1000, 0], 'arcRadius': 5,
		'circleRadius': 100, 'circlePosition': [0, 0], 'out': -1},
	{'heading': 0, 'position': [0, 0], 'arcRadius': 1,
		'circleRadius': 1, 'circlePosition': [2, 1], 'out': 90, 'errorThreshold': 0.000001},
	];
	processArcAngleToCircleTests(cases, getArcRightAngleToCircle, logger);
};