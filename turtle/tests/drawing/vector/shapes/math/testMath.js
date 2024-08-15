import { testGetEllipseDiagonalRadius } from './testGetEllipseDiagonalRadius.js';
import { testGetPathDirectionVectorAfter } from './testGetPathDirectionVectorAfter.js';
import { testGetPathDirectionVectorBefore } from './testGetPathDirectionVectorBefore.js';
import { testSmartRounder } from './testSmartRounder.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testMath(logger) {
	wrapAndCall([
		testGetEllipseDiagonalRadius,
		testGetPathDirectionVectorAfter,
		testGetPathDirectionVectorBefore,
		testSmartRounder
	], logger);
};