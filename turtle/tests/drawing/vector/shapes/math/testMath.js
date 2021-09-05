import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { testGetEllipseDiagonalRadius } from './testGetEllipseDiagonalRadius.js';
import { testSmartRounder } from './testSmartRounder.js';

export function testMath(logger) {
	testGetEllipseDiagonalRadius(prefixWrapper('testGetEllipseDiagonalRadius', logger));
	testSmartRounder(prefixWrapper('testSmartRounder', logger));
};