import { testOptimizeBooleanExpression } from
'./testOptimizeBooleanExpression.js';
import { testOptimizeJS } from
'./testOptimizeJS.js';
import { testOptimizePushedIfStatementConditions } from
'./testOptimizePushedIfStatementConditions.js';
import { testOptimizeVariableAccess } from
'./optimize-variable-access/testOptimizeVariableAccess.js';
import { testOptimizeVariableAccessInJavaScript } from
'./testOptimizeVariableAccessInJavaScript.js';
import { testRemoveUnneededCurvedBrackets } from
'./testRemoveUnneededCurvedBrackets.js';
import { testSanitizeMergedJS } from
'./testSanitizeMergedJS.js';
import { testTokenClassifiers } from './token-classifiers/testTokenClassifiers.js';
import { wrapAndCall } from '../../../../../helpers/wrapAndCall.js';

export function testOptimizeJSDirectory(logger) {
	wrapAndCall([
		testOptimizeBooleanExpression,
		testOptimizeJS,
		testOptimizePushedIfStatementConditions,
		testOptimizeVariableAccess,
		testOptimizeVariableAccessInJavaScript,
		testRemoveUnneededCurvedBrackets,
		testSanitizeMergedJS,
		testTokenClassifiers
	], logger);
};