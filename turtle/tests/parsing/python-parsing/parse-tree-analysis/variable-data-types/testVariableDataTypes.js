import { testAnalyzeTokenDataTypes } from './testAnalyzeTokenDataTypes.js';
import { testEvaluateTokensBasic } from './testEvaluateTokensBasic.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testVariableDataTypes(logger) {
	wrapAndCall([
		testAnalyzeTokenDataTypes,
		testEvaluateTokensBasic
	], logger);
};