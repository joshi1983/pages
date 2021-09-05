import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { testIsSimpleRect } from './testIsSimpleRect.js';

export function testSimpleRect(logger) {
	testIsSimpleRect(prefixWrapper('testIsSimpleRect', logger));
};