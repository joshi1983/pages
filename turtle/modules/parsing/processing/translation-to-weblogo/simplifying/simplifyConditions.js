import { getDescendentsOfTypes } from
'../../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { wrapInCurvedBrackets } from './wrapInCurvedBrackets.js';

export function simplifyConditions(root) {
	const conditionParents = getDescendentsOfTypes(root, [ParseTreeTokenType.IF, ParseTreeTokenType.WHILE]);
	for (const conditionParent of conditionParents) {
		const child = conditionParent.children[0];
		wrapInCurvedBrackets(child);
	}
};