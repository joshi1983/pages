import { argListBracketBalanceFixer } from './argListBracketBalanceFixer.js';
import { forToRepeatFor } from './forToRepeatFor.js';
import { functionsToMethods } from './functionsToMethods.js';
import { insertBeginEndShape } from './insertBeginEndShape.js';
import { quoteStringsFixer } from './quoteStringsFixer.js';
import { renameClashingDefNames } from './renameClashingDefNames.js';
import { replaceRangeToWithToOperator } from './replaceRangeToWithToOperator.js';

const simplifiers = [
	argListBracketBalanceFixer,
	forToRepeatFor,
	functionsToMethods,
	insertBeginEndShape,
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