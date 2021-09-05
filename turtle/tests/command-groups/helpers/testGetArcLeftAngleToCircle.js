import { getArcLeftAngleToCircle } from '../../../modules/command-groups/helpers/getArcLeftAngleToCircle.js';
import { processArcAngleToCircleTests } from './processArcAngleToCircleTests.js';

export function testGetArcLeftAngleToCircle(logger) {
	const cases = [
	{'heading': 0, 'position': [0, 0], 'arcRadius': 5, 
		'circleRadius': 100, 'circlePosition': [0, 0], 'out': -1},
	{'heading': 0, 'position': [1000, 0], 'arcRadius': 5,
		'circleRadius': 100, 'circlePosition': [0, 0], 'out': -1},
	{'heading': 0, 'position': [1, 0], 'arcRadius': 1,
		'circleRadius': 1, 'circlePosition': [-1, 1], 'out': 90, 'errorThreshold': 0.000001},
	{'heading': 0, 'position': [0, 0], 'arcRadius': 1,
		'circleRadius': 1, 'circlePosition': [1, -1], 'out': -1},
	{'heading': 0, 'position': [0, 0], 'arcRadius': 2,
		'circleRadius': 1, 'circlePosition': [1, -1], 'out': -1},

	// Some cases from a WebLogo procedure that was visualizing
	// the desired numbers.
	{'heading': 0, 'position': [0, 0], 'arcRadius': 10, 'circleRadius': 10,
	'circlePosition': [0, 4], 'out': 79.21870, 'errorThreshold': 0.00001},
	{'heading': 0, 'position': [0, 0], 'arcRadius': 10, 'circleRadius': 10,
	'circlePosition': [0, -4], 'out': 35.61588, 'errorThreshold': 0.00001},
	{'heading': 0, 'position': [0, 0], 'arcRadius': 10, 'circleRadius': 10,
	'circlePosition': [-2, -4], 'out': 36.86990, 'errorThreshold': 0.00001},
	{'heading': 0, 'position': [0, 0], 'arcRadius': 10, 'circleRadius': 10,
	'circlePosition': [-2, 4], 'out': 90, 'errorThreshold': 0.00001},
	{'heading': 0, 'position': [0, 0], 'arcRadius': 10, 'circleRadius': 10,
	'circlePosition': [3, 4], 'out': 64.25334, 'errorThreshold': 0.00001},
	{'heading': 0, 'position': [0, 0], 'arcRadius': 10, 'circleRadius': 10,
	'circlePosition': [3, -11], 'out': 288.1355, 'errorThreshold': 0.0001},
	{'heading': 0, 'position': [0, 0], 'arcRadius': 10, 'circleRadius': 12,
	'circlePosition': [3, -11], 'out': 3.520526, 'errorThreshold': 0.00001},
	{'heading': 0, 'position': [0, 0], 'arcRadius': 10, 'circleRadius': 5,
	'circlePosition': [-3, -2], 'out': 12.51970, 'errorThreshold': 0.00001},
	{'heading': 0, 'position': [0, 0], 'arcRadius': 10, 'circleRadius': 5,
	'circlePosition': [-3, 2], 'out': 44.41049, 'errorThreshold': 0.00001},
	];
	processArcAngleToCircleTests(cases, getArcLeftAngleToCircle, logger);
};