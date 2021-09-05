import { convertGotoToInfiniteFor } from './convertGotoToInfiniteFor.js';
import { removeGotoSkippedSections } from './removeGotoSkippedSections.js';
import { removeUnreferencedLabels } from './removeUnreferencedLabels.js';
import { simplifyIfStatementsWithConstantConditions } from './simplifyIfStatementsWithConstantConditions.js';

const simplifiers = [
	convertGotoToInfiniteFor,
	removeGotoSkippedSections,
	removeUnreferencedLabels,
	simplifyIfStatementsWithConstantConditions
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