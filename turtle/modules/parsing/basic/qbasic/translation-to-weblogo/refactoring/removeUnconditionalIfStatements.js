import { evaluateToken } from
'../../evaluation/evaluateToken.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isOfInterest(token) {
	const children = token.children;
	if (children.length < 3 ||
	children.length > 4)
		return false;

	const endif = children[3];
	if (endif !== undefined &&
	endif.type !== ParseTreeTokenType.END_IF)
		return false;

	const condition = children[0];
	const val = evaluateToken(condition);
	if (val === undefined)
		return false;

	return true;
}

export function removeUnconditionalIfStatements(root) {
	const ifTokens = getDescendentsOfType(root, ParseTreeTokenType.IF).
		filter(isOfInterest);
	ifTokens.forEach(function(ifToken) {
		const parent = ifToken.parentNode;
		let children = ifToken.children;
		const condition = children[0];
		const val = evaluateToken(condition);
		if (!val) {
			ifToken.remove();
		}
		else {
			condition.remove();
			const codeBlock = children[1];
			children = codeBlock.children;
			parent.replaceChild(ifToken, codeBlock);
			for (let i = children.length - 1; i >= 0; i--) {
				const c = children[i];
				c.remove();
				codeBlock.appendSibling(c);
			}
			codeBlock.remove();
		}
	});
	return ifTokens.length !== 0;
};