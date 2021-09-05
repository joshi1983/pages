import { areTokensEvaluatingEqual } from
'./areTokensEvaluatingEqual.js';
import { getAllDescendentsAsArray } from
'../../../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { mightHaveSideEffects } from
'../../../../../../parsing/parse-tree-analysis/mightHaveSideEffects.js';
import { ParseTreeTokenType } from
'../../../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(token) {
	return findTokenToCancelWith(token) !== null;
}

function addMultipliedTerms(token, result) {
	result.push(token);
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR) {
		if (token.val === '*' &&
		token.children.length === 2) {
			for (const child of token.children) {
				addMultipliedTerms(child, result);
			}
		}
		else if (token.val === '/' &&
		token.children.length === 2) {
			addMultipliedTerms(token.children[0], result);
		}
	}
	else if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
		for (const child of token.children) {
			if (!child.isBracket())
				addMultipliedTerms(child, result);
		}
	}
}

function findTokenToCancelWith(token) {
	if (token.val !== '/')
		return null;

	const children = token.children;
	if (children.length !== 2)
		return null;

	const leftChild = children[0];
	const rightChild = children[1];
	if (areTokensEvaluatingEqual(leftChild, rightChild))
		return leftChild;
	
	if (!mightHaveSideEffects(leftChild)) {
		const multipliedTerms = [];
		addMultipliedTerms(leftChild, multipliedTerms);
		for (const child of multipliedTerms) {
			if (areTokensEvaluatingEqual(child, rightChild))
				return child;
		}
	}
	
	return null;
}

function convertToOne(token, cachedParseTree) {
	const oldType = token.type;
	const toRemove = getAllDescendentsAsArray(token);
	if (toRemove.length !== 0) {
		token.removeAllChildren();
		cachedParseTree.tokensRemoved(toRemove);
	}
	token.val = 1;
	token.type = ParseTreeTokenType.NUMBER_LITERAL;
	token.originalString = '' + token.val;
	if (oldType !== token.type)
		cachedParseTree.tokenTypeChanged(token, oldType);
}

export function cancelDivisions(cachedParseTree, fixLogger) {
	const cancellations = cachedParseTree.getTokensByType(ParseTreeTokenType.BINARY_OPERATOR).
		filter(isOfInterest);
	cancellations.forEach(function(divisionToken) {
		const withToken = findTokenToCancelWith(divisionToken);
		if (withToken !== null) {
			const children = divisionToken.children;
			const rightChild = children[1];
			const withParent = withToken.parentNode;
			const toRemove = getAllDescendentsAsArray(rightChild);
			toRemove.push(rightChild);
			rightChild.remove();
			convertToOne(withToken, cachedParseTree);
			if (withParent.type === ParseTreeTokenType.BINARY_OPERATOR &&
			withParent.val === '*') {
				withToken.remove();
				withParent.removeSingleToken();
				toRemove.push(withToken, withParent);
			}
			divisionToken.removeSingleToken();
			toRemove.push(divisionToken);
			cachedParseTree.tokensRemoved(toRemove);
			fixLogger.log(`Cancelled / operation because it simplifies the code without changing the result.`, divisionToken);
		}
	});
	return cancellations.length !== 0;
};