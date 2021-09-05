import { conditionalGotoToBreak } from './conditionalGotoToBreak.js';
import { convertGotoToInfiniteFor } from './convertGotoToInfiniteFor.js';
import { gotoToBreak } from './gotoToBreak.js';
import { gotoToContinue } from './gotoToContinue.js';
import { removeGotoSkippedSections } from './removeGotoSkippedSections.js';
import { removeUnreferencedLabels } from './removeUnreferencedLabels.js';
import { simplifyIfStatementsWithConstantConditions } from './simplifyIfStatementsWithConstantConditions.js';

const simplifiers = [
	conditionalGotoToBreak,
	convertGotoToInfiniteFor,
	gotoToBreak,
	gotoToContinue,
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