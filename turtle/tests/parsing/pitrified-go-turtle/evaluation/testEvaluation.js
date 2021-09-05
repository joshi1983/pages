import { testEvaluateNumberLiteralString } from './testEvaluateNumberLiteralString.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testEvaluation(logger) {
	wrapAndCall([
		testEvaluateNumberLiteralString
	], logger);
};