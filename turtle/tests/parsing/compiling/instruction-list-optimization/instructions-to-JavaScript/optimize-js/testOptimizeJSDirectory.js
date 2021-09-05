import { testMergeConsecutiveValueStackPushes } from
'./testMergeConsecutiveValueStackPushes.js';
import { testMergeValueStackLastMutations } from
'./testMergeValueStackLastMutations.js';
import { testMergeValueStackPops } from
'./testMergeValueStackPops.js';
import { testOptimizeBooleanExpression } from
'./testOptimizeBooleanExpression.js';
import { testOptimizeJS } from
'./testOptimizeJS.js';
import { testOptimizePushedIfStatementConditions } from
'./testOptimizePushedIfStatementConditions.js';
import { testOptimizeSetProperty } from './testOptimizeSetProperty.js';
import { testOptimizeVariableAccess } from
'./optimize-variable-access/testOptimizeVariableAccess.js';
import { testOptimizeVariableAccessInJavaScript } from
'./testOptimizeVariableAccessInJavaScript.js';
import { testReduceValueStackPushes } from
'./testReduceValueStackPushes.js';
import { testRemoveUnneededAssignments } from
'./testRemoveUnneededAssignments.js';
import { testRemoveUnneededCurvedBrackets } from
'./testRemoveUnneededCurvedBrackets.js';
import { testSanitizeMergedJS } from
'./testSanitizeMergedJS.js';
import { testTokenClassifiers } from './token-classifiers/testTokenClassifiers.js';
import { wrapAndCall } from '../../../../../helpers/wrapAndCall.js';

export function testOptimizeJSDirectory(logger) {
	wrapAndCall([
		testMergeConsecutiveValueStackPushes,
		testMergeValueStackLastMutations,
		testMergeValueStackPops,
		testOptimizeBooleanExpression,
		testOptimizeJS,
		testOptimizePushedIfStatementConditions,
		testOptimizeSetProperty,
		testOptimizeVariableAccess,
		testOptimizeVariableAccessInJavaScript,
		testReduceValueStackPushes,
		testRemoveUnneededAssignments,
		testRemoveUnneededCurvedBrackets,
		testSanitizeMergedJS,
		testTokenClassifiers
	], logger);
};