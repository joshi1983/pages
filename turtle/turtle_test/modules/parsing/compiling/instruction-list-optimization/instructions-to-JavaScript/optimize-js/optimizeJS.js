import { mergeConsecutiveValueStackPushes } from './mergeConsecutiveValueStackPushes.js';
import { mergeValueStackLastMutations } from './mergeValueStackLastMutations.js';
import { mergeValueStackPops } from './mergeValueStackPops.js';
import { optimizeSetProperty } from './optimizeSetProperty.js';
import { optimizeVariableAccessInJavaScript } from './optimizeVariableAccessInJavaScript.js';
import { reduceValueStackPushes } from './reduceValueStackPushes.js';
import { removeUnneededAssignments } from './removeUnneededAssignments.js';
import { removeUnneededCurvedBrackets } from './removeUnneededCurvedBrackets.js';

const optimizers = [
mergeConsecutiveValueStackPushes,
mergeValueStackLastMutations,
mergeValueStackPops,
optimizeSetProperty,
optimizeVariableAccessInJavaScript,
reduceValueStackPushes,
removeUnneededAssignments,
removeUnneededCurvedBrackets
];
export function optimizeJS(code, isForProcedure) {
	for (let i = 0; i < optimizers.length; i++) {
		const optimizer = optimizers[i];
		code = optimizer(code, isForProcedure);
	}
	return code;
};