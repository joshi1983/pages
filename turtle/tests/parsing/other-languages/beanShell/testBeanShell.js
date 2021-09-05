import { testIsLikelyBeanShell } from './testIsLikelyBeanShell.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testBeanShell(logger) {
	wrapAndCall([
		testIsLikelyBeanShell
	], logger);
};