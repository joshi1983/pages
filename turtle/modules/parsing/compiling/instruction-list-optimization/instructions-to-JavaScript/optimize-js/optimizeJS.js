import { optimizeVariableAccessInJavaScript } from './optimizeVariableAccessInJavaScript.js';
import { removeUnneededCurvedBrackets } from './removeUnneededCurvedBrackets.js';

const optimizers = [
optimizeVariableAccessInJavaScript,
removeUnneededCurvedBrackets
];
export function optimizeJS(code) {
	for (let i = 0; i < optimizers.length; i++) {
		const optimizer = optimizers[i];
		code = optimizer(code);
	}
	return code;
};