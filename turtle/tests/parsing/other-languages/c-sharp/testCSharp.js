import { testIsLikelyCSharp } from './testIsLikelyCSharp.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testCSharp(logger) {
	wrapAndCall([
		testIsLikelyCSharp
	], logger);
};