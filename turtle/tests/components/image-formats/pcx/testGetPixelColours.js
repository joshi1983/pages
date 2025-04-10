import { getPixelColours } from
'../../../../modules/components/image-formats/pcx/getPixelColours.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testGetPixelColours(logger) {
	const cases = [
		/*{'inArgs': [[1], [[0, 0, 0, 255], [255, 255, 255, 255]], 1, 1, 8, 1],
		'out': [[[255, 255, 255, 255]]]},
		{'inArgs': [[0], [[0, 0, 0, 255], [255, 255, 255, 255]], 1, 1, 8, 1],
		'out': [[[0, 0, 0, 255]]]},
		*/{'inArgs': [[0x40, 0],
		[[0, 0, 0, 255], [255, 255, 255, 255]], 2, 1, 2, 1],
		'out': [[[255, 255, 255, 255], [0, 0, 0, 255]]]},
		//{'inArgs': [[50, 0, 100, 0, 150, 0], [], 1, 1, 8, 3],
		//'out': [[[50, 100, 150, 255]]]},
	];
	testInOutPairs(cases, getPixelColours, logger);
};