import { quoteStringsFixer } from './quoteStringsFixer.js';
import { renameClashingDefNames } from './renameClashingDefNames.js';
import { replaceRangeToWithToOperator } from './replaceRangeToWithToOperator.js';

const simplifiers = [
	quoteStringsFixer,
	renameClashingDefNames,
	replaceRangeToWithToOperator
];

export function simplify(root) {
	let keepSimplifying = true;
	while (keepSimplifying) {
		keepSimplifying = false;
		for (const simplifier of simplifiers) {
			keepSimplifying = keepSimplifying || simplifier(root);
		}
	}
};