import { testEvaluateStringLiteralString } from './testEvaluateStringLiteralString.js';
import { testEvaluateToken } from './testEvaluateToken.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testEvaluation(logger) {
	wrapAndCall([
		testEvaluateStringLiteralString,
		testEvaluateToken
	], logger);
};