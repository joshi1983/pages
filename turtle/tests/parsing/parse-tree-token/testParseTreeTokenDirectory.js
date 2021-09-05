import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testIsAfterOrSame } from './testIsAfterOrSame.js';

export function testParseTreeTokenDirectory(logger) {
	testIsAfterOrSame(prefixWrapper('testIsAfterOrSame', logger));
};