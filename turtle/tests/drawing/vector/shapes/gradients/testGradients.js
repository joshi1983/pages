import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { testLinearGradient } from './testLinearGradient.js';
import { testRadialGradient } from './testRadialGradient.js';
import { testSpreadMethod } from './testSpreadMethod.js';

export function testGradients(logger) {
	testLinearGradient(prefixWrapper('testLinearGradient', logger));
	testRadialGradient(prefixWrapper('testRadialGradient', logger));
	testSpreadMethod(prefixWrapper('testSpreadMethod', logger));
};