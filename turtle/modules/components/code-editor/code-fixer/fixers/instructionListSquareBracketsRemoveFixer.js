import { isInstructionList } from '../../../../parsing/parse-tree-analysis/isInstructionList.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';

const typesIndicatingNonInterest = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR,
]);

function isOfInterest(token) {
	if (token.children.length < 2)
		return false;
	if (isInstructionList(token))
		return false;
	if (!isInstructionList(token.parentNode))
		return false;
	for (const child of token.children) {
		if (child.type !== ParseTreeTokenType.LEAF || (child.val !== '[' && child.val !== ']')) {
			if (typesIndicatingNonInterest.has(child))
				return false;
		}
	}
	return true;
}

export function instructionListSquareBracketsRemoveFixer(cachedParseTree, fixLogger) {
	const lists = cachedParseTree.getTokensByType(ParseTreeTokenType.LIST).
		filter(isOfInterest);
	const tokensToRemove = [];
	lists.forEach(function(listToken) {
		const squareLeftBracket = listToken.children[0];
		let squareRightBracket = listToken.children[listToken.children.length - 1];
		squareLeftBracket.remove();
		if (squareRightBracket.val !== ']')
			squareRightBracket = undefined;
		else {
			squareRightBracket.remove();
			tokensToRemove.push(squareRightBracket);
		}
		while (listToken.children.length > 0) {
			const firstChild = listToken.children[0];
			firstChild.remove();
			listToken.appendPreviousSibling(firstChild);
		}
		listToken.remove();
		tokensToRemove.push(squareLeftBracket, listToken);
		fixLogger.log(`Removed square brackets for an instruction list that didn't need them`, listToken);
	});
	cachedParseTree.tokensRemoved(tokensToRemove);
};