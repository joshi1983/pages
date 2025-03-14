import { testInOutPairs } from '../../helpers/testInOutPairs.js';
import { triLengthsToRadianAngle } from '../../../modules/command-groups/helpers/triLengthsToRadianAngle.js';

export function testTriLengthsToRadianAngle(logger) {
	const cases = [
	// based on example at https://www.mathsisfun.com/algebra/trig-cosine-law.html
	// The example gave 57.9 degrees but we want radians.
	// I used Windows calculator to compute the exact cosine ratio, degrees, and convert to radians.
	{'inArgs': [8, 6, 7], 'out': 1.0107210205683146139426297479748},
	// The angle between lengths 3 and 4 should be 90 degrees.
	// based on lesson at: https://www.youtube.com/watch?v=l9z85yXfKF0
	{'inArgs': [3, 4, 5], 'out': 1.5707963267948966192313216916398},

	// not much of a triangle. more like 2 overlapping line segments
	{'inArgs': [1, 1, 0], 'out': 0},
	{'inArgs': [1, 0, 1], 'out': 0},
	{'inArgs': [0, 1, 1], 'out': 0},

	// tolerate a reasonable amount of floating point error.
	// Those exact numbers describe an impossible triangle but we want to
	// tolerate those anyway because they're extremely close to a valid triangle.
	{'inArgs': [35.68000000000001, 29.005799999999994, 64.6858], 'out': Math.PI},
	{'inArgs': [50.3, 50.300000000000004, 0], 'out': 0}, // another impossible triangle we want to tolerate.
	];
	testInOutPairs(cases, triLengthsToRadianAngle, logger);
};