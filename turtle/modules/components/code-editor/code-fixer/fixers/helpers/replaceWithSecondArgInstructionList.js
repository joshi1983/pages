import { ArrayUtils } from
'../../../../../ArrayUtils.js';
import { getAllDescendentsAsArray } from
'../../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

export function mayWantToReplaceWithSecondArgInstructionList(token) {
	const next = token.nextSibling;
	if (next === null)
		return false;

	const instructionList = next.nextSibling;
	if (instructionList === null ||
	instructionList.type !== ParseTreeTokenType.LIST)
		return false;
	return true;
}

export function replaceWithSecondArgInstructionList(token, cachedParseTree) {
		const firstArgToken = token.nextSibling;
		const instructionListToken = firstArgToken.nextSibling;
		const removed = [token, firstArgToken];
		ArrayUtils.pushAll(removed, getAllDescendentsAsArray(firstArgToken));
		const children = instructionListToken.children;
		if (children[0].isBracket())
			removed.push(children[0]);
		if (children.length > 1 && children[children.length - 1].isBracket())
			removed.push(children[children.length - 1]);
		removed.forEach(r => r.remove());
		for (const child of children) {
			if (child.parentNode !== null) {
				child.remove();
				instructionListToken.appendPreviousSibling(child);
			}
		}
		instructionListToken.remove();
		removed.push(instructionListToken);

		cachedParseTree.tokensRemoved(removed);
};