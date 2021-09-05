import { ArrayUtils } from
'../../../../../ArrayUtils.js';
import { getAllDescendentsAsArray } from
'../../../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getClosestOfType } from
'../../../../generic-parsing-utilities/getClosestOfType.js';
import { getSortedLastDescendentTokenOf } from
'../../../../generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { getTakenVariableNames, isLikelyVariableReference } from
'./getTakenVariableNames.js';
import { getUniqueIdentifier } from
'../../../../generic-parsing-utilities/getUniqueIdentifier.js';
import { isInProcedure } from
'../../../../parse-tree-analysis/isInProcedure.js';
import { ParseTreeToken } from
'../../../../ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
import { placeTokensAfter } from
'../../../../generic-parsing-utilities/placeTokensAfter.js';

const nextNextTokenTypes = new Set([
	ParseTreeTokenType.LIST,
	ParseTreeTokenType.LONG_STRING_LITERAL,
	ParseTreeTokenType.PARAMETERIZED_GROUP,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.VARIABLE_READ
]);

function mightReferenceVariable(token) {
	if (token.type === ParseTreeTokenType.VARIABLE_READ)
		return true;
	if (token.isStringLiteral()) {
		if (isLikelyVariableReference(token))
			return true;
	}
	return false;
}

function isOfInterest(forEachToken) {
	if (forEachToken.val.toLowerCase() !== 'foreach')
		return false;

	const next = forEachToken.nextSibling;
	if (next === null || !next.isStringLiteral()) {
		return false;
	}
	const nextNext = next.nextSibling;
	if (nextNext === null || !nextNextTokenTypes.has(nextNext.type))
		return false;

	const afterNextNext = nextNext.nextSibling;
	if (afterNextNext === null ||
	afterNextNext.type !== ParseTreeTokenType.LIST)
		return false;

	return true;
}

function loopHasNoIterations(foreachToken) {
	const stringOrListToken = foreachToken.nextSibling.nextSibling;
	if (stringOrListToken.isStringLiteral()) {
		if (stringOrListToken.val === '')
			return true;
	}
	else if (stringOrListToken.type === ParseTreeTokenType.LIST) {
		if (stringOrListToken.children.every(c => c.isBracket()))
			return true;
	}
	return false;
}

function isPotentialVariableReadInDescendents(token, variableName, excluded) {
	if (excluded.has(token))
		return false;
	if (typeof token.val === 'string' && mightReferenceVariable(token) &&
	token.val.toLowerCase() === variableName) {
		return true;
	}
	for (const child of token.children) {
		if (isPotentialVariableReadInDescendents(child, variableName, excluded))
			return true;
	}
	return false;
}

function shouldMakeForeachVariable1(foreachToken) {
	const variableNameToken = foreachToken.nextSibling;
	const variableName = variableNameToken.val.toLowerCase();
	const procedure = getClosestOfType(foreachToken,
		ParseTreeTokenType.PROCEDURE_START_KEYWORD);
	const instructionList = foreachToken.nextSibling.nextSibling.nextSibling;
	const excluded = new Set([foreachToken, instructionList]);
	if (procedure === null) {
		const root = getClosestOfType(foreachToken,
		ParseTreeTokenType.TREE_ROOT);
		if (isPotentialVariableReadInDescendents(root, variableName, excluded))
			return true;
	}
	else {
		if (isPotentialVariableReadInDescendents(procedure, variableName, excluded))
			return true;
	}
	return false;
}

function shouldMakeVariable(foreachToken) {
	const listOrStringToken = foreachToken.nextSibling.nextSibling;
	return listOrStringToken.children.length !== 0;
}

// Inserts tokens similar to code like:
// make "i item repcount :_1
function insertMake(cachedParseTree, makeCommandName,
variableName, variableName2, beforeToken) {
	const makeToken = new ParseTreeToken(makeCommandName, null, beforeToken.lineIndex,
		beforeToken.colIndex, ParseTreeTokenType.PARAMETERIZED_GROUP);
	const stringLiteral = new ParseTreeToken(variableName, null, beforeToken.lineIndex,
		beforeToken.colIndex + 1, ParseTreeTokenType.STRING_LITERAL);
	const itemToken = new ParseTreeToken('item', null, beforeToken.lineIndex,
		beforeToken.colIndex + 2, ParseTreeTokenType.PARAMETERIZED_GROUP);
	const repcountToken = new ParseTreeToken('repcount', null, beforeToken.lineIndex,
		beforeToken.colIndex + 3, ParseTreeTokenType.PARAMETERIZED_GROUP);
	const variableNameToken = new ParseTreeToken(variableName2, null,
		beforeToken.lineIndex, beforeToken.colIndex + 4,
		ParseTreeTokenType.VARIABLE_READ);
	itemToken.appendChild(repcountToken);
	itemToken.appendChild(variableNameToken);
	makeToken.appendChild(stringLiteral);
	makeToken.appendChild(itemToken);
	beforeToken.appendSibling(makeToken);
	cachedParseTree.tokensAdded([makeToken, itemToken, repcountToken, stringLiteral, variableNameToken]);
}

export function foreachFixer(cachedParseTree, fixLogger) {
	const foreaches = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	if (foreaches.length !== 0) {
		const takenNames = getTakenVariableNames(cachedParseTree);
		foreaches.forEach(function(foreachToken) {
			const variableNameToken = foreachToken.nextSibling;
			const oldVariableName = variableNameToken.val;
			const listOrStringValueToken = variableNameToken.nextSibling;
			const instructionListToken = listOrStringValueToken.nextSibling;
			const inProc = isInProcedure(foreachToken);
			const makeCommandName = inProc ? 'localmake' : 'make';
			let newVariableName;
			if (loopHasNoIterations(foreachToken)) {
				if (shouldMakeForeachVariable1(foreachToken)) {
					foreachToken.val = makeCommandName;
					foreachToken.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
					cachedParseTree.tokenTypeChanged(foreachToken,
						ParseTreeTokenType.LEAF);
					variableNameToken.remove();
					foreachToken.appendChild(variableNameToken);
					const oldType = listOrStringValueToken.type;
					listOrStringValueToken.type = ParseTreeTokenType.NUMBER_LITERAL;
					listOrStringValueToken.val = 1;
					listOrStringValueToken.originalString = '1';
					listOrStringValueToken.remove();
					foreachToken.appendChild(listOrStringValueToken);
					cachedParseTree.tokensRemoved(getAllDescendentsAsArray(listOrStringValueToken, false));
					cachedParseTree.tokenTypeChanged(listOrStringValueToken, oldType);
					listOrStringValueToken.removeAllChildren();
					instructionListToken.remove();
					cachedParseTree.tokensRemoved(getAllDescendentsAsArray(instructionListToken, true));
					fixLogger.log(`Simplified foreach loop to make ${variableNameToken.val} 1 because the foreach loop had no iterations.`, foreachToken);
				}
				else {
					const descendents = [foreachToken];
					foreachToken.remove();
					variableNameToken.remove();
					descendents.push(variableNameToken);
					listOrStringValueToken.remove();
					ArrayUtils.pushAll(descendents, getAllDescendentsAsArray(listOrStringValueToken, true));
					instructionListToken.remove();
					ArrayUtils.pushAll(descendents, getAllDescendentsAsArray(instructionListToken, true));
					cachedParseTree.tokensRemoved(descendents);
					fixLogger.log(`Removed foreach loop since it did nothing.`, foreachToken);
				}
			}
			else {
				let singularListOrStringToken, newVariableName, makingNewRepeatToken = false;
				if (shouldMakeVariable(foreachToken)) {
					foreachToken.val = makeCommandName;
					makingNewRepeatToken = true;
					newVariableName = getUniqueIdentifier(takenNames, '_'); // for example, '_1'
					takenNames.add(newVariableName);
					const newVariableNameToken = new ParseTreeToken(newVariableName,
						null, foreachToken.lineIndex,
						foreachToken.colIndex, ParseTreeTokenType.STRING_LITERAL);
					foreachToken.appendChild(newVariableNameToken);
					listOrStringValueToken.remove();
					foreachToken.appendChild(listOrStringValueToken);
					instructionListToken.remove();
					const positionToken = instructionListToken.children[0];
					const variableReadToken = new ParseTreeToken(newVariableName,
						null, positionToken.lineIndex,
						positionToken.colIndex, ParseTreeTokenType.VARIABLE_READ);
					singularListOrStringToken = variableReadToken;
					cachedParseTree.tokensAdded([newVariableNameToken, variableReadToken]);
				}
				else {
					foreachToken.val = 'repeat';
					singularListOrStringToken = listOrStringValueToken;
					newVariableName = singularListOrStringToken.val;
				}
				foreachToken.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
				cachedParseTree.tokenTypeChanged(foreachToken,
					ParseTreeTokenType.LEAF);
				const oldVariableNameTokenType = variableNameToken.type;
				variableNameToken.val = 'count';
				variableNameToken.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
				cachedParseTree.tokenTypeChanged(variableNameToken, oldVariableNameTokenType);
				if (singularListOrStringToken.parentNode !== null)
					singularListOrStringToken.remove();
				variableNameToken.appendChild(singularListOrStringToken);
				if (makingNewRepeatToken) {
					const repeatToken = new ParseTreeToken('repeat', null,
						variableNameToken.lineIndex,
						Math.max(0, variableNameToken.colIndex - 1), ParseTreeTokenType.PARAMETERIZED_GROUP);
					variableNameToken.remove();
					repeatToken.appendChild(variableNameToken);
					repeatToken.appendChild(instructionListToken);
					foreachToken.appendSibling(repeatToken);
					cachedParseTree.tokenAdded(repeatToken);
					const prevSibling = repeatToken.previousSibling;
					if (prevSibling !== null) {
						const rightMostPrev =
							getSortedLastDescendentTokenOf(prevSibling);
						const repeatDescendents = getAllDescendentsAsArray(repeatToken, true);
						placeTokensAfter(repeatDescendents, rightMostPrev);
					}
				}
				else {
					variableNameToken.remove();
					foreachToken.appendChild(variableNameToken);
					instructionListToken.remove();
					foreachToken.appendChild(instructionListToken);
				}
				insertMake(cachedParseTree, makeCommandName, oldVariableName, newVariableName,
					instructionListToken.children[0]);
				fixLogger.log(`Replaced foreach with repeat since foreach is not supported by WebLogo.`, foreachToken);
			}
		});
	}
};