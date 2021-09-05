import { ArrayUtils } from
'../../../../ArrayUtils.js';
import { Command } from
'../../../../parsing/Command.js';
import { DataType } from
'../../../../parsing/data-types/DataType.js';
import { getAllDescendentsAsArray } from
'../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { insertColIndexSpanAt } from
'../../../../parsing/generic-parsing-utilities/insertColIndexSpanAt.js';
import { isInProcedure } from
'../../../../parsing/parse-tree-analysis/isInProcedure.js';
import { isInstructionList } from
'../../../../parsing/parse-tree-analysis/isInstructionList.js';
import { ParseTreeToken } from
'../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../parsing/ParseTreeTokenType.js';

function throwToInstructionList(throwToken) {
	let i = throwToken.parentNode;
	let c = throwToken;
	const nullResult = [null, null];
	if (i === null || (!isInstructionList(i) &&
	i.type !== ParseTreeTokenType.CURVED_BRACKET_EXPRESSION))
		return nullResult;
	if (i.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
		if (i.children.indexOf(throwToken) !== 1)
			return nullResult;
		c = i;
		i = i.parentNode;
	}
	if (i === null || !isInstructionList(i))
		return nullResult;

	// We want to convert code like:
	// if (condition) [
	//		throw "error
	// ]
	// to something like:
	// assert condition
	// If there are other instructions before the throw, 
	// replacing with assert is more difficult than 
	// we want to handle here.
	const index = i.children.indexOf(c);
	if (index > 1)
		return nullResult;
	else if (index === 1) {
		const prev = i.children[0];
		if (prev.val !== '[' || !prev.isBracket())
			return nullResult;
	}

	return [i, c];
}

function shouldReplaceWithAssert(throwToken) {
	const [instructionList, child] = throwToInstructionList(throwToken);
	if (instructionList === null || instructionList.type !== ParseTreeTokenType.LIST)
		return false;
	
	const index = instructionList.children.indexOf(throwToken);
	if (index > 1)
		return false;
	else if (index === 1) {
		const prev = throwToken.previousSibling;
		if (prev.val !== '[' || !prev.isBracket())
			return false;
	}
	const grandParent = instructionList.parentNode;
	if (grandParent === null || grandParent.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(grandParent.val);
	if (info === undefined || info.primaryName !== 'if')
		return false;
	if (grandParent.children.indexOf(instructionList) !== 1)
		return false;
	return true;
}

function replaceWithAssert(throwToken, cachedParseTree, removed) {
	const [instructionList, child] = throwToInstructionList(throwToken);
	const ifToken = instructionList.parentNode;
	const oldVal = ifToken.val;
	ifToken.val = 'assert';
	cachedParseTree.tokenValueChanged(ifToken, oldVal);
	const conditionToken = ifToken.children[0];
	const notToken = new ParseTreeToken('not', null, ifToken.lineIndex, ifToken.colIndex + 1,
		ParseTreeTokenType.PARAMETERIZED_GROUP);
	ifToken.replaceChild(conditionToken, notToken);

	notToken.appendChild(conditionToken);
	insertColIndexSpanAt(notToken, 5);
	cachedParseTree.tokenAdded(notToken);
	ArrayUtils.pushAll(removed, getAllDescendentsAsArray(instructionList));
	removed.push(instructionList, throwToken);
}

function isOfInterest(token) {
	if (token.val.toLowerCase() !== 'throw')
		return false;
	const [instructionList, child] = throwToInstructionList(token);
	// if parent is not an instruction list, we don't know how to fix it.
	if (instructionList === null)
		return false;
	const next = token.nextSibling;
	if (next === null || next.isBracket())
		return false;
	return DataType.mayBeData(next.type);
}

function shouldReplaceWithStop(throwToken) {
	if (!isInProcedure(throwToken))
		return false;
	return true;
}

function removeAfter(token, removed) {
	token = token.nextSibling;
	// remove all siblings and their descendent tokens after token
	// up to but excluding a ']' that sometimes marks the end of an instruction list.
	while (token !== null && (token.val !== ']' || !token.isBracket())) {
		ArrayUtils.pushAll(removed, getAllDescendentsAsArray(token));
		const next = token.nextSibling;
		removed.push(token);
		token = next;
	}
}

function removeCurvedBracketParent(token, removed) {
	const parent = token.parentNode;
	const grandParent = parent.parentNode;
	grandParent.replaceChild(parent, token);
	ArrayUtils.pushAll(removed, getAllDescendentsAsArray(parent));
	removed.push(parent);
}

export function throwFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	tokens.forEach(function(token) {
		const parent = token.parentNode;
		let removed = [];
		const isReplacingWithAssert = shouldReplaceWithAssert(token);
		const isReplacingWithStop = shouldReplaceWithStop(token);
		if (parent.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
			removeCurvedBracketParent(token, removed);
		if (isReplacingWithAssert)
			replaceWithAssert(token, cachedParseTree, removed);
		else {
			removeAfter(token, removed);
			ArrayUtils.pushAll(removed, getAllDescendentsAsArray(token));
		}
		if (isReplacingWithStop) {
			const oldVal = token.val;
			token.val = 'stop';
			token.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
			cachedParseTree.tokenValueChanged(token, oldVal);
			cachedParseTree.tokenTypeChanged(token, ParseTreeTokenType.LEAF);
		}
		else
			removed.push(token);

		removed = Array.from(new Set(removed.filter(t => t.parentNode !== null))); // remove duplicated tokens.
		removed.forEach(t => t.remove());
		cachedParseTree.tokensRemoved(removed);

		if (isReplacingWithStop) {
			fixLogger.log(`Replaced call to throw with stop because WebLogo does not support throw.`, token);
		}
		else
			fixLogger.log(`Removed a call to throw because WebLogo does not support throw.`, token);
	});
};