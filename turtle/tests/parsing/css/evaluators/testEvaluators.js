import { testEvaluateToken } from './testEvaluateToken.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testEvaluators(logger) {
	wrapAndCall([
		testEvaluateToken
	], logger);
};