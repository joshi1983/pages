import { Command } from '../../../../parsing/Command.js';
import { getAllDescendentsAsArray } from '../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getDescendentsOfType } from '../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { getLastDescendentTokenOf } from '../../../../parsing/parse-tree-token/getLastDescendentTokenOf.js';
import { isInstructionList } from '../../../../parsing/parse-tree-analysis/isInstructionList.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { SetUtils } from '../../../../SetUtils.js';

const namesOfInterestRightLeft = new Set();
['left', 'right'].forEach(function(name) {
	const info = Command.getCommandInfo(name);
	const names = Command.getLowerCaseCommandNameSet(info);
	SetUtils.addAll(namesOfInterestRightLeft, names);
});
const headingNames = Command.getLowerCaseCommandNameSet('heading');

function isUnsafeParameterTokenSingle(token) {
	const info = Command.getCommandInfo(token.val);
	return info === undefined || info.primaryName === 'heading';
}

function isUnsafeParameterToken(token) {
	return getDescendentsOfType(token, ParseTreeTokenType.PARAMETERIZED_GROUP).
		some(isUnsafeParameterTokenSingle);
}

function isNextOfInterest(next) {
	if (next === null || next.type !== ParseTreeTokenType.PARAMETERIZED_GROUP || next.children.length !== 1)
		return false;
	if (!namesOfInterestRightLeft.has(next.val.toLowerCase()))
		return false;
	if (isUnsafeParameterToken(next.children[0]))
		return false;
	return true;
}

function isOfInterestRightLeft(token) {
	if (token === null || token.parentNode === null)
		return false;
	if (!isInstructionList(token.parentNode))
		return false;
	if (!isNextOfInterest(token))
		return false;
	return isNextOfInterest(token.nextSibling);
}

function mightHaveSideEffectsSingleToken(token) {
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return true;
	return info.isIndependentlyUseful !== false;
}

function isSafeToRemoveBeforeSetHeading(token) {
	if (token === null || token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return false;
	if (info.primaryName !== 'right' && info.primaryName !== 'left' &&
	info.primaryName !== 'setHeading')
		return false;
	const tokens = getDescendentsOfType(token, ParseTreeTokenType.PARAMETERIZED_GROUP);
	return !tokens.some(tok => (tok !== token && mightHaveSideEffectsSingleToken(tok)) ||
		headingNames.has(tok.val.toLowerCase()));
}

function isOfInterestBeforeSetHeading(token) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return false; // procedure calls are not of interest.
	if (info.primaryName !== 'setHeading')
		return false;
	if (!isInstructionList(token.parentNode))
		return false;
	if (!isSafeToRemoveBeforeSetHeading(token))
		return false;
	return isSafeToRemoveBeforeSetHeading(token.previousSibling);
}

function isOppositeDirection(command1, command2) {
	if (command1.primaryName === 'setHeading' || command2.primaryName === 'setHeading' ||
	command1.primaryName === command2.primaryName)
		return false;
	return true;
}

function areBracketsImportant(token) {
	return token.children.length !== 0;
}

function simplifyBeforeSetHeading(cachedParseTree, fixLogger) {
	const ofInterest = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterestBeforeSetHeading);
	const tokensToSkip = new Set();
	ofInterest.reverse();
	ofInterest.forEach(function(setHeadingToken) {
		if (tokensToSkip.has(setHeadingToken))
			return;
		const prevCommandNames = [];
		let node = setHeadingToken.previousSibling;
		while (isSafeToRemoveBeforeSetHeading(node)) {
			const name = node.val.toLowerCase();
			if (prevCommandNames.indexOf(name) === -1)
				prevCommandNames.push(name);
			const previousSibling = node.previousSibling;
			const tokensToRemove = getAllDescendentsAsArray(node);
			node.remove();
			tokensToRemove.push(node);
			cachedParseTree.tokensRemoved(tokensToRemove);
			tokensToSkip.add(node);
			node = previousSibling;
		}
		fixLogger.log(`Removed some redundent calls to ${prevCommandNames.join(', ')} immediately before setHeading`, setHeadingToken);
	});
}

function simplifyRightLeft(cachedParseTree, fixLogger) {
	const ofInterest = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterestRightLeft);
	const tokensToSkip = new Set();
	ofInterest.forEach(function(callToken) {
		if (tokensToSkip.has(callToken))
			return;
		const callCommandInfo = Command.getCommandInfo(callToken.val);
		let node = callToken.nextSibling;
		let lastToken = getLastDescendentTokenOf(callToken);
		while (isNextOfInterest(node)) {
			const child = node.children[0];
			const nextSibling = node.nextSibling;
			node.remove();
			const nodeInfo = Command.getCommandInfo(node.val);
			let binaryOperatorVal = '+';
			if (isOppositeDirection(callCommandInfo, nodeInfo)) {
				binaryOperatorVal = '-';
			}
			const operatorToken = new ParseTreeToken(binaryOperatorVal, null, node.lineIndex, node.colIndex, ParseTreeTokenType.BINARY_OPERATOR);
			child.remove();
			const callTokenChild = callToken.children[0];
			callTokenChild.remove();
			operatorToken.appendChild(callTokenChild);
			callToken.appendChild(operatorToken);
			if (areBracketsImportant(child)) {
				const lastDescendent = getLastDescendentTokenOf(child);
				const bracketStart = new ParseTreeToken('(', null, node.lineIndex, node.colIndex + 1, ParseTreeTokenType.LEAF);
				const bracketEnd = new ParseTreeToken(')', null, lastDescendent.lineIndex, lastDescendent.colIndex + 1, ParseTreeTokenType.LEAF);
				const curvedBracketExpression = new ParseTreeToken(null, null, node.lineIndex, node.colIndex, ParseTreeTokenType.CURVED_BRACKET_EXPRESSION);
				curvedBracketExpression.appendChild(bracketStart);
				curvedBracketExpression.appendChild(child);
				curvedBracketExpression.appendChild(bracketEnd);
				operatorToken.appendChild(curvedBracketExpression);
				cachedParseTree.tokensAdded([bracketStart, bracketEnd, curvedBracketExpression]);
			}
			else {
				operatorToken.appendChild(child);
			}
			lastToken = getLastDescendentTokenOf(child);
			cachedParseTree.tokenAdded(operatorToken);
			cachedParseTree.tokenRemoved(node);
			tokensToSkip.add(node);
			node = nextSibling;
		}
		fixLogger.log(`Combined a command or more after ${callToken.val} into one to shorten the code.`, callToken);
	});
}

export function simplifySetHeadingFixer(cachedParseTree, fixLogger) {
	simplifyBeforeSetHeading(cachedParseTree, fixLogger);
	simplifyRightLeft(cachedParseTree, fixLogger);
};