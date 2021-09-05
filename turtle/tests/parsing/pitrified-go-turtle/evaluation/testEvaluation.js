import { testEvaluateCharacterLiteral } from './testEvaluateCharacterLiteral.js';
import { testEvaluateNumberLiteralString } from './testEvaluateNumberLiteralString.js';
import { testEvaluateStringLiteral } from './testEvaluateStringLiteral.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testEvaluation(logger) {
	wrapAndCall([
		testEvaluateCharacterLiteral,
		testEvaluateNumberLiteralString,
		testEvaluateStringLiteral
	], logger);
};