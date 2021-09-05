import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { MigrationInfo } from
'../../MigrationInfo.js';
import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function shouldBeCodeBlockOrTreeRootChild(token) {
	if (token.type === ParseTreeTokenType.FUNC_CALL) {
		const info = MigrationInfo.getFunctionInfo(token);
		if (info !== undefined && info.returnTypes === null)
			return true;
	}
	return false;
}

function isOfInterest(token) {
	const children = token.children;
	if (children.length === 0)
		return false; // no problem.  Nothing to fix.
	const firstChild = children[0];
	if (firstChild.type !== ParseTreeTokenType.CURVED_LEFT_BRACKET)
		return false; // weird case but also one we are not fixing here.

	const lastChild = children[children.length - 1];
	if (lastChild.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET)
		return false; // nothing to fix.

	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.FUNC_CALL)
		return false; // this fixer isn't tested on cases involving DEF argument lists.

	const grandparent = parent.parentNode;
	if (grandparent.type !== ParseTreeTokenType.TREE_ROOT &&
	grandparent.type !== ParseTreeTokenType.CODE_BLOCK)
		return false;

	// look for a token that should be a direct child of a CODE_BLOCK or TREE_ROOT.
	return children.some(shouldBeCodeBlockOrTreeRootChild);
}

export function argListBracketBalanceFixer(root) {
	const argLists = getDescendentsOfType(root, ParseTreeTokenType.ARG_LIST).filter(isOfInterest);
	argLists.forEach(function(argList) {
		let i;
		for (i = 0; i < argList.children.length; i++) {
			const child = argList.children[i];
			if (shouldBeCodeBlockOrTreeRootChild(child))
				break;
		}
		const parent = argList.parentNode;
		while (argList.children.length > i) {
			const child = argList.children[argList.children.length - 1];
			child.remove();
			parent.appendSibling(child);
		}
		const posToken = argList.children[i - 1];
		const closeBracket = new ParseTreeToken(')', posToken.lineIndex, posToken.colIndex, ParseTreeTokenType.CURVED_RIGHT_BRACKET);
		argList.appendChild(closeBracket);
	});
	return argLists.length !== 0;
}