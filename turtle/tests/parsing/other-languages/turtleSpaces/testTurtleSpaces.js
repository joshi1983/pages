import { testIsLikelyTurtleSpaces } from './testIsLikelyTurtleSpaces.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testTurtleSpaces(logger) {
	wrapAndCall([
		testIsLikelyTurtleSpaces
	], logger);
};