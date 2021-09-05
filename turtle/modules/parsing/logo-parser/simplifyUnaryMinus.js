import { getDescendentsOfType } from '../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isOfInterest(token) {
	const children = token.children;
	const firstChild = children[0];
	if (token.val !== '-' || children.length !== 1 ||
		firstChild.type !== ParseTreeTokenType.NUMBER_LITERAL)
		return false;

	// we want the tokens to be right next to each other.
	// Removing a whitespace between them to simplify the parse tree would hurt the syntax highlighter in the code editor.
	// In other words, removing a space might simplify the tree in 1 way but introduce bugs.
	return token.lineIndex === firstChild.lineIndex &&
		token.colIndex === firstChild.colIndex - firstChild.originalString.length;
}

export function simplifyUnaryMinus(root) {
	const minusTokens = getDescendentsOfType(root, ParseTreeTokenType.UNARY_OPERATOR).
		filter(isOfInterest);
	for (const minusToken of minusTokens) {
		minusToken.type = ParseTreeTokenType.NUMBER_LITERAL;
		const child = minusToken.children[0];
		minusToken.val = -child.val;
		if (minusToken.val < 0)
			minusToken.originalString = '-' + child.originalString;
		else
			minusToken.originalString = child.originalString.substring(1);
			// remove the existing - prefix because they'll cancel each other out.

		minusToken.lineIndex = child.lineIndex;
		minusToken.colIndex = child.colIndex;
		child.remove();
	}
};