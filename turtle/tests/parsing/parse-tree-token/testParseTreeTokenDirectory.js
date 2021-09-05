import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testGetDescendentsOfTypes } from './testGetDescendentsOfTypes.js';
import { testIsAfterOrSame } from './testIsAfterOrSame.js';

export function testParseTreeTokenDirectory(logger) {
	testGetDescendentsOfTypes(prefixWrapper('testGetDescendentsOfTypes', logger));
	testIsAfterOrSame(prefixWrapper('testIsAfterOrSame', logger));
};