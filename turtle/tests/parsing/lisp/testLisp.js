import { testArc } from './arc/testArc.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testLisp(logger) {
	wrapAndCall([
		testArc
	], logger);
};