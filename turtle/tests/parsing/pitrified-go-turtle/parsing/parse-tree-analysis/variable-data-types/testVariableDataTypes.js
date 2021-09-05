import { testEvaluateTokenDataTypes } from './testEvaluateTokenDataTypes.js';
import { testEvaluateTokensBasic } from
'./testEvaluateTokensBasic.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testVariableDataTypes(logger) {
	wrapAndCall([
		testEvaluateTokenDataTypes,
		testEvaluateTokensBasic,
	], logger);
};