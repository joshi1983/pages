import { testIsLikelyFSharp } from './testIsLikelyFSharp.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testFSharp(logger) {
	wrapAndCall([
		testIsLikelyFSharp
	], logger);
};