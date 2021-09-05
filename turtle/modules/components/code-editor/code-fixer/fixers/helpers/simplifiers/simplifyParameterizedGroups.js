import { ArrayUtils } from
'../../../../../../ArrayUtils.js';
import { Command } from
'../../../../../../parsing/Command.js';
import { getAllDescendentsAsArray } from
'../../../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getTokenValueBasic } from
'../../../../../../parsing/parse-tree-analysis/variable-data-types/getTokenValueBasic.js';
import { isDefinitelyOne } from
'../../../../../../parsing/parse-tree-analysis/variable-data-types/token-evaluation/isDefinitelyOne.js';
import { isDefinitelyZero } from
'../../../../../../parsing/parse-tree-analysis/variable-data-types/token-evaluation/isDefinitelyZero.js';
import { mightHaveSideEffects } from
'../../../../../../parsing/parse-tree-analysis/mightHaveSideEffects.js';
import { ParseTreeTokenType } from
'../../../../../../parsing/ParseTreeTokenType.js';

export const countChildNames = new Set([
	'vectorAdd', 'vectorScale', 'vectorSubtract'
]);

export const cloneNotNeededChildNames = new Set([
	'butFirst', 'butLast', 'clone', 'vectorAdd', 'vectorScale', 'vectorSubtract'
]);

function removeAllButFirstChild(token) {
	const toRemove = [];
	const children = token.children.slice();
	for (let i = 1; i < children.length; i++) {
		const child = children[i];
		child.remove();
		toRemove.push(child);
		ArrayUtils.pushAll(toRemove, getAllDescendentsAsArray(child));
	}
	return toRemove;
}

function convertToClone(token, cachedParseTree, fixLogger) {
	const oldVal = token.val;
	const toRemove = removeAllButFirstChild(token);
	token.val = 'clone';
	cachedParseTree.tokensRemoved(toRemove);
	fixLogger.log(`Replaced ${oldVal} with clone because it does the same faster.`, token);	
}

function convertToFirstChild(token, cachedParseTree, fixLogger) {
	const toRemove = removeAllButFirstChild(token);
	toRemove.push(token);
	token.removeSingleToken();
	cachedParseTree.tokensRemoved(toRemove);
	fixLogger.log(`Removed ${token.val} because it doesn't change the result`, token);
}

function convertToOne(token, cachedParseTree, fixLogger) {
	token.val = 1;
	token.originalString = '' + token.val;
	cachedParseTree.tokensRemoved(getAllDescendentsAsArray(token));
	token.removeAllChildren();
	fixLogger.log(`Replaced with 1 because that is always the value.`, token);
}

function convertToSqrt(token, cachedParseTree, fixLogger) {
	token.val = 'sqrt';
	const toRemove = removeAllButFirstChild(token);
	cachedParseTree.tokensRemoved(toRemove);
	fixLogger.log(`Replaced power with sqrt because (sqrt :x) = (power :x 0.5).`, token);
}

function removeZerosInList(token, cachedParseTree, fixLogger) {
	const child = token.children[0];
	const toRemove = [];
	let removeCount = 0;
	for (const listChild of child.children) {
		if (isDefinitelyZero(listChild)) {
			ArrayUtils.pushAll(toRemove, getAllDescendentsAsArray(listChild));
			listChild.remove();
			toRemove.push(listChild);
			removeCount++;
		}
	}
	cachedParseTree.tokensRemoved(toRemove);
	fixLogger.log(`Removed ${removeCount} zeros from list because they won't affect the result of hypot.`, child);
}

function shouldRemoveZerosFromHypotList(token) {
	const info = Command.getCommandInfo(token.val);
	if (info === undefined ||
	info.primaryName !== 'hypot')
		return false;

	const child = token.children[0];
	if (child.type !== ParseTreeTokenType.LIST)
		return false;

	return child.children.some(isDefinitelyZero);
}

function shouldSimplifyToClone(token) {
	const children = token.children;
	if (children.length !== 2)
		return false;

	const info = Command.getCommandInfo(token.val);
	if (info === undefined ||
	info.primaryName !== 'vectorScale')
		return false;

	const lastChild = children[children.length - 1];
	if (isDefinitelyOne(lastChild) && !mightHaveSideEffects(lastChild)) {
		/*:x = (vectorScale :x 1)  
		We want to make sure the vectorScale :x 1 isn't done to create a clone.
		It is a rare case but it could lead to bugs.
		"clone" should be faster than vectorScale :x 1 in such a case without introducing such a bug.
		*/
		const firstChild = children[0];
		if (firstChild.type === ParseTreeTokenType.LIST)
			return false; // mutating the list should be fine without cloning 
			// since a new list is made here anyway.

		if (firstChild.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			const childInfo = Command.getCommandInfo(firstChild.val);
			if (childInfo !== undefined && cloneNotNeededChildNames.has(childInfo.primaryName)) {
				return false;
			}
		}

		// if print is found, 
		let tok = token.parentNode;
		for (let tok = token.parentNode; tok !== null; tok = tok.parentNode) {
			if (tok.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
				const tokInfo = Command.getCommandInfo(tok.val);
				if (tokInfo === undefined ||
				tokInfo.primaryName === 'output' || tokInfo.primaryName === 'make' ||
				tokInfo.primaryName === 'localmake')
					return true; // procedures might mutate the list.
				if (tokInfo.primaryName === 'print')
					return false;
			}
		}
		return true;
	}
	return false;
}

function shouldSimplifyToFirstChild(token) {
	const children = token.children;
	if (children.length !== 2)
		return false;

	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return false;

	if (countChildNames.has(info.primaryName)) {
		const parent = token.parentNode;
		if (parent.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			const pInfo = Command.getCommandInfo(parent.val);
			if (pInfo !== undefined && pInfo.primaryName === 'count')
				return true;
			/*
			This simplification is possible because:
			(count :x) = (count vectorScale :x :y)
			(count :x) = (count vectorAdd :x :y)
			(count :x) = (count vectorSubtract :x :y)

			parent would represent the count call.
			*/
		}
	}
	if (info === undefined ||
	(info.primaryName !== 'power' && info.primaryName !== 'vectorScale'))
		return false;

	const lastChild = children[children.length - 1];
	return isDefinitelyOne(lastChild) && !mightHaveSideEffects(lastChild);
	/*
	This simplification is possible because:
	:x = (vectorScale :x 1)  
	:x = (power :x 1)

	*/
}

function shouldSimplifyToSqrt(token) {
	const children = token.children;
	if (children.length !== 2)
		return false;

	const info = Command.getCommandInfo(token.val);
	if (info === undefined || info.primaryName !== 'power')
		return false;

	const lastChild = children[children.length - 1];
	return getTokenValueBasic(lastChild) === 0.5 &&
		!mightHaveSideEffects(lastChild);
	/*
	This simplification is possible because:
	(sqrt :x) = (power :x 0.5)
	*/
}

function shouldSimplifyToOne(token) {
	const info = Command.getCommandInfo(token.val);
	if (info === undefined || info.primaryName !== 'power')
		return false;

	const children = token.children;
	const lastChild = children[children.length - 1];
	/*
	This simplification is possible because:
	1 = (power :x 0)
	*/
}

function isOfInterest(token) {
	for (const [should, _] of pairs) {
		if (should(token))
			return true;
	}
	return false;
}

const pairs = [
	[shouldSimplifyToClone, convertToClone],
	[shouldSimplifyToFirstChild, convertToFirstChild],
	[shouldRemoveZerosFromHypotList, removeZerosInList],
	[shouldSimplifyToSqrt, convertToSqrt],
	[shouldSimplifyToOne, convertToOne]
];

export function simplifyParameterizedGroups(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	tokens.forEach(function(token) {
		if (token.parentNode === null)
			return; // a previous iteration might have removed token already.

		for (const [isApplicable, process] of pairs) {
			if (isApplicable(token)) {
				process(token, cachedParseTree, fixLogger);
			}
		}
	});
	return tokens.length !== 0;
};