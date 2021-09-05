import { testIsLikelyGroovy } from './testIsLikelyGroovy.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testGroovy(logger) {
	wrapAndCall([
		testIsLikelyGroovy
	], logger);
};