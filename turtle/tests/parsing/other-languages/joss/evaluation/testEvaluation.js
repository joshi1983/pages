import { testEvaluateNumberLiteral } from './testEvaluateNumberLiteral.js';
import { testEvaluateStringLiteral } from './testEvaluateStringLiteral.js';
import { testEvaluateToken } from './testEvaluateToken.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testEvaluation(logger) {
	wrapAndCall([
		testEvaluateNumberLiteral,
		testEvaluateStringLiteral,
		testEvaluateToken
	], logger);
};