import { testIsLikelyProlog } from './testIsLikelyProlog.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testProlog(logger) {
	wrapAndCall([
		testIsLikelyProlog
	], logger);
};