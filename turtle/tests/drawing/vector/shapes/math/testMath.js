import { testGetEllipseDiagonalRadius } from './testGetEllipseDiagonalRadius.js';
import { testSmartRounder } from './testSmartRounder.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testMath(logger) {
	wrapAndCall([
		testGetEllipseDiagonalRadius,
		testSmartRounder
	], logger);
};