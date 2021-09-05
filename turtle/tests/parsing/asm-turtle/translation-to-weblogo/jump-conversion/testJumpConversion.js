import { testGetValidJumpsFromTree } from './testGetValidJumpsFromTree.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testJumpConversion(logger) {
	wrapAndCall([
		testGetValidJumpsFromTree
	], logger);
};