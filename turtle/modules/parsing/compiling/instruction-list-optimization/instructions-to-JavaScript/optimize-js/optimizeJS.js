import { mergeConsecutiveValueStackPushes } from './mergeConsecutiveValueStackPushes.js';
import { mergeValueStackPops } from './mergeValueStackPops.js';
import { optimizeVariableAccessInJavaScript } from './optimizeVariableAccessInJavaScript.js';
import { reduceValueStackPushes } from './reduceValueStackPushes.js';
import { removeUnneededAssignments } from './removeUnneededAssignments.js';
import { removeUnneededCurvedBrackets } from './removeUnneededCurvedBrackets.js';

const optimizers = [
mergeConsecutiveValueStackPushes,
mergeValueStackPops,
optimizeVariableAccessInJavaScript,
reduceValueStackPushes,
removeUnneededAssignments,
removeUnneededCurvedBrackets
];
export function optimizeJS(code) {
	for (let i = 0; i < optimizers.length; i++) {
		const optimizer = optimizers[i];
		code = optimizer(code);
	}
	return code;
};