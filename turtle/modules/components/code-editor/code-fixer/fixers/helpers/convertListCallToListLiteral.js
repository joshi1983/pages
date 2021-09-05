import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

/*
token should be a CURVED_BRACKET_EXPRESSION containing a call to the list command as its second child.
*/
export function convertListCallToListLiteral(token, cachedParseTree) {
	const parent = token.parentNode;
	const oldType = parent.type;
	const children = parent.children;
	const firstChild = children[0];
	const lastChild = children[children.length - 1];
	if (firstChild.type === ParseTreeTokenType.LEAF &&
	firstChild.val === '(')
		firstChild.val = '[';
	if (lastChild.type === ParseTreeTokenType.LEAF &&
	lastChild.val === ')')
		lastChild.val = ']';
	parent.type = ParseTreeTokenType.LIST;
	while (token.children.length !== 0) {
		const child = token.children[token.children.length - 1];
		child.remove();
		firstChild.appendSibling(child);
	}
	token.remove();
	cachedParseTree.tokenRemoved(token);
	cachedParseTree.tokenTypeChanged(parent, oldType);
};