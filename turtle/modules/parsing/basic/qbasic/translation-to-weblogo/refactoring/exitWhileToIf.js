import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getLastDescendentTokenOf } from
'../../../../generic-parsing-utilities/getLastDescendentTokenOf.js';
import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isExitWhile(token) {
	if (token.type !== ParseTreeTokenType.EXIT)
		return false;
	const child = token.children[0];
	return child !== undefined &&
		child.type === ParseTreeTokenType.WHILE;
}

function isOfInterest(token) {
	const children = token.children;
	if (children.length < 2)
		return false;

	const codeBlock = children[1];
	for (const child of codeBlock.children) {
		if (isExitWhile(child)) {
			return true;
		}
	}
	return false;
}

export function exitWhileToIf(root) {
	const whiles = getDescendentsOfType(root, ParseTreeTokenType.WHILE).
		filter(isOfInterest);
	whiles.forEach(function(whileToken) {
		const children = whileToken.children;
		const condition = children[0];
		const codeBlock = children[1];
		const wendToken = children[2];
		whileToken.type = ParseTreeTokenType.IF;
		whileToken.val = 'IF';
		for (let i = 0; i < codeBlock.children.length; i++) {
			const child = codeBlock.children[i];
			if (isExitWhile(child)) {
				// remove every child at and after the EXIT WHILE statement.
				while (codeBlock.children.length > i) {
					const child2 = codeBlock.children[i];
					child2.remove();
				}
			}
		}
		const conditionLast = getLastDescendentTokenOf(condition);
		const thenToken = new ParseTreeToken('THEN',
			conditionLast.lineIndex, conditionLast.colIndex + 1,
			ParseTreeTokenType.THEN);
		condition.appendSibling(thenToken);
		if (wendToken !== undefined) {
			wendToken.type = ParseTreeTokenType.END_IF;
			wendToken.val = null;
			const endToken = new ParseTreeToken('END',
				wendToken.lineIndex, wendToken.colIndex,
				ParseTreeTokenType.END);
			wendToken.appendChild(endToken);
			const ifToken = new ParseTreeToken('IF',
				wendToken.lineIndex, wendToken.colIndex + 1,
				ParseTreeTokenType.IF);
			wendToken.appendChild(ifToken);
		}
	});
	return whiles.length !== 0;
};