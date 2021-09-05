import { testIsLikelyJulia } from './testIsLikelyJulia.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testJulia(logger) {
	wrapAndCall([
		testIsLikelyJulia
	], logger);
};