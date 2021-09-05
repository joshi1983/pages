import { testIsLikelyJava } from './testIsLikelyJava.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testJava(logger) {
	wrapAndCall([
		testIsLikelyJava
	], logger);
};