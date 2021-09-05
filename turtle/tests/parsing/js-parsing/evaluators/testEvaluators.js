import { testEvaluateLiteralToken } from './testEvaluateLiteralToken.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testEvaluators(logger) {
	wrapAndCall([
		testEvaluateLiteralToken
	], logger);
};