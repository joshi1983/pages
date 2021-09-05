import { evaluateNumberLiteral } from
'../../evaluation/evaluateNumberLiteral.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isOfInterest(token) {
	const children = token.children;
	if (children.length !== 1)
		return false;

	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.FOR)
		return false;

	const child = children[0];
	if (child.type !== ParseTreeTokenType.NUMBER_LITERAL)
		return false;

	const val = evaluateNumberLiteral(child);
	return val === 1;
}

export function removeRedundantStep(root) {
	const steps = getDescendentsOfType(root, ParseTreeTokenType.STEP).
		filter(isOfInterest);
	steps.forEach(step => step.remove());
	return steps.length !== 0;
};