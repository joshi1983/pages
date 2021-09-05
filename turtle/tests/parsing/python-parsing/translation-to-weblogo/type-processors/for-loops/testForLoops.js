import { prefixWrapper } from '../../../../../helpers/prefixWrapper.js';
import { testIsNeedingNewVariable } from './testIsNeedingNewVariable.js';

export function testForLoops(logger) {
	testIsNeedingNewVariable(prefixWrapper('testIsNeedingNewVariable', logger));
};