import { testEvaluateNumberLiteralString } from './testEvaluateNumberLiteralString.js';
import { testEvaluateStringLiteral } from './testEvaluateStringLiteral.js';
import { testEvaluateToken } from './testEvaluateToken.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testEvaluation(logger) {
	wrapAndCall([
		testEvaluateNumberLiteralString,
		testEvaluateStringLiteral,
		testEvaluateToken
	], logger);
};