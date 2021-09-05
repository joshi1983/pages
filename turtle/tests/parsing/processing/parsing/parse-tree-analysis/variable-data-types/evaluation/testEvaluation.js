import { testEvaluateToken } from './testEvaluateToken.js';
import { wrapAndCall } from
'../../../../../../helpers/wrapAndCall.js';

export function testEvaluation(logger) {
	wrapAndCall([
		testEvaluateToken
	], logger);
	
};