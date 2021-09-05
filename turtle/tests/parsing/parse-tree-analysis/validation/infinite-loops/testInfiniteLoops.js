import { testIsAllOrNothingWhileLoop } from './testIsAllOrNothingWhileLoop.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testInfiniteLoops(logger) {
	wrapAndCall([
		testIsAllOrNothingWhileLoop
	], logger);
};