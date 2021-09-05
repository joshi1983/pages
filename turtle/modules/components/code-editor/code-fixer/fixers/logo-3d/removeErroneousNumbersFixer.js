import { Command } from
'../../../../../parsing/Command.js';
import { isInstructionList } from
'../../../../../parsing/parse-tree-analysis/isInstructionList.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();
const repeatNames = Command.getLowerCaseCommandNameSet(Command.getCommandInfo('repeat'));
const typesNotToHaveAsParameters = new Set([
	ParseTreeTokenType.COMMENT,
	ParseTreeTokenType.NEW_LINE,
	ParseTreeTokenType.PROCEDURE_START_KEYWORD,
	ParseTreeTokenType.PROCEDURE_END_KEYWORD,
	ParseTreeTokenType.TREE_ROOT,
]);
function hasRepeatParent(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
	repeatNames.has(parent.val.toLowerCase()) &&
	parent.children.indexOf(token) > 0)
		return true;
	return false;
}

function isExtraParameterInRpt(token) {
	if (hasRepeatParent(token))
		return true;
	const prev = token.previousSibling;
	if (prev === null)
		return false;
	let prevPrev = prev.previousSibling;
	while (prevPrev !== null && prevPrev.type === ParseTreeTokenType.NUMBER_LITERAL)
		prevPrev = prevPrev.previousSibling;
	if (prevPrev === null)
		return false;
	return (prevPrev.type === ParseTreeTokenType.LEAF ||
	prevPrev.type === ParseTreeTokenType.PARAMETERIZED_GROUP) && prevPrev.val === 'rpt';
}

function isInstructionListLogo3DAdapted(token) {
	if (isInstructionList(token))
		return true;
	if (token.type === ParseTreeTokenType.LIST) {
		let prev = token.previousSibling;
		while (prev !== null && prev.type === ParseTreeTokenType.NUMBER_LITERAL) {
			prev = prev.previousSibling;
		}
		if (prev === null)
			return false;
		if (prev.type === ParseTreeTokenType.LEAF && prev.val === 'rpt')
			return true;
	}
	return false;
}

function isOfInterest(cachedParseTree) {
	const procs = new Set(cachedParseTree.proceduresMap.keys());
	return function(token) {
		if (isExtraParameterInRpt(token))
			return true;
		const parent = token.parentNode;
		if (isInstructionListLogo3DAdapted(parent)) {
			const str = token.originalString;
			if (procs.has(str))
				return false;
			const prev = token.previousSibling;
			if (prev !== null &&
			prev.type === ParseTreeTokenType.LEAF) {
				return prev.isBracket();
			}
			return false;
		}
		return false;
	};
}

function canBeAppendedAsParameter(token) {
	if (token === null)
		return false;
	if (typesNotToHaveAsParameters.has(token.type))
		return false;
	return !token.isBracket();
}

export function removeErroneousNumbersFixer(cachedParseTree, fixLogger) {
	const tokensToRemove = cachedParseTree.getTokensByType(ParseTreeTokenType.NUMBER_LITERAL).
		filter(isOfInterest(cachedParseTree));
	tokensToRemove.forEach(function(tokenToRemove) {
		const parent = tokenToRemove.parentNode;
		const hadRepeatParent = hasRepeatParent(tokenToRemove);
		tokenToRemove.remove();
		if (hadRepeatParent && parent !== null &&
		canBeAppendedAsParameter(parent.nextSibling)) {
			const next = parent.nextSibling;
			next.remove();
			parent.appendChild(next);
		}
		fixLogger.log(`Removed ${tokenToRemove.originalString} because it was erroneous`, tokenToRemove);
	});
	cachedParseTree.tokensRemoved(tokensToRemove);
};