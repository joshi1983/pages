import { testTuring } from './turing/testTuring.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testPascal(logger) {
	wrapAndCall([
		testTuring
	], logger);
};