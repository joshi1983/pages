import { getBlurRatios } from '../../../../modules/drawing/vector/animation/getBlurRatios.js';

export function testGetBlurRatios(logger) {
	for (let i = 1; i < 5; i++) {
		const result = getBlurRatios(i, 0.3);
		if (result.length !== i)
			logger(`Expected length of ${i} but got ${result.length}`);
		else {
			for (let j = 0; j < result.length; j++) {
				if (result[j] <= 0)
					logger('All values should be more than 0 but got ' + result[j] + ' at index ' + j + ' and length ' + i);
			}
		}
	}
};