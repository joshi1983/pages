import { DataListType } from
'../../../../parsing/data-types/DataListType.js';
import { getAllVariableNamesSet } from
'./helpers/getAllVariableNamesSet.js';
import { getDescendentsOfType } from
'../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { getSortedFirstDescendentTokenOf } from
'../../../../parsing/generic-parsing-utilities/getSortedFirstDescendentTokenOf.js';
import { insertColIndexSpanAt } from
'../../../../parsing/generic-parsing-utilities/insertColIndexSpanAt.js';
import { insertLineIndexSpanAt } from
'../../../../parsing/generic-parsing-utilities/insertLineIndexSpanAt.js';
import { isInProcedure } from
'../../../../parsing/parse-tree-analysis/isInProcedure.js';
import { ParseTreeToken } from
'../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../parsing/ParseTreeTokenType.js';

const listType = new DataListType();

function isOfInterest(token) {
	if (token.val.toLowerCase() !== 'foreach')
		return false;
	const next = token.nextSibling;
	if (next === null || !listType.mayBeCompatibleWith(next))
		return false;
	const nextNext = next.nextSibling;
	if (nextNext === null || nextNext.type !== ParseTreeTokenType.LIST)
		return false;
	return true;
}

function getDistinctVariableNameAndAddToAll(prefix, allVariableNames) {
	let name = prefix;
	for (let i = 1; allVariableNames.has(name.toLowerCase()); i++) {
		name = prefix + i;
	}
	allVariableNames.add(name.toLowerCase());
	return name;
}

function getDistinctVariableNameForList(listToken, allVariableNames) {
	return getDistinctVariableNameAndAddToAll('foreachList', allVariableNames);
}

function countLinesInList(listToken) {
	const children = listToken.children;
	const firstChild = children[0];
	const lastChild = children[children.length - 1];
	return lastChild.lineIndex - firstChild.lineIndex;
}

function getMakeName(token) {
	return isInProcedure(token) ? 'localmake' : 'make';
}

function declareVariableBeforeLoop(listToken, cachedParseTree, allVariableNames) {
	const listLineCount = 1 + countLinesInList(listToken);
	const variableName = getDistinctVariableNameForList(listToken, allVariableNames);
	const foreachToken = listToken.previousSibling;
	const makeName = getMakeName(listToken);
	const make = new ParseTreeToken(makeName, null,
		foreachToken.lineIndex, foreachToken.colIndex,
		ParseTreeTokenType.PARAMETERIZED_GROUP);
	const variableNameToken = new ParseTreeToken(variableName, null, 
		make.lineIndex, listToken.colIndex - 1,
		ParseTreeTokenType.STRING_LITERAL);
	const variableReadToken = new ParseTreeToken(variableName, null, 
		foreachToken.lineIndex, foreachToken.colIndex + variableName.length,
		ParseTreeTokenType.VARIABLE_READ);
	insertColIndexSpanAt(foreachToken, 10);
	make.appendChild(variableNameToken);
	listToken.parentNode.replaceChild(listToken, variableReadToken);
	make.appendChild(listToken);
	insertLineIndexSpanAt(foreachToken, listLineCount);
	foreachToken.lineIndex += listLineCount;
	foreachToken.appendPreviousSibling(make);
	cachedParseTree.tokensAdded([make, variableNameToken, variableReadToken]);
	return variableName;
}

function addCountTokenAndMakeParameterizedGroup(repeatToken, cachedParseTree) {
	const oldType = repeatToken.type;
	const listValToken = repeatToken.nextSibling;
	const instructionListToken = listValToken.nextSibling;
	if (instructionListToken === null)
		throw new Error(`Expected instructionListToken to be a token but got null`);
	insertColIndexSpanAt(repeatToken, 6);
	const countToken = new ParseTreeToken('count', null, repeatToken.lineIndex, repeatToken.colIndex + 6,
		ParseTreeTokenType.PARAMETERIZED_GROUP);
	listValToken.remove();
	countToken.appendChild(listValToken);
	repeatToken.appendChild(countToken);
	instructionListToken.remove();
	repeatToken.appendChild(instructionListToken);
	cachedParseTree.tokenAdded(countToken);
	repeatToken.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
	cachedParseTree.tokenTypeChanged(repeatToken, oldType);
}

function getSymbolReferences(symbol) {
	function resultFunction(token, result) {
		if (typeof token.val === 'string' &&
		token.val.toLowerCase() === 'foreach'
		&& !token.isStringLiteral()) {
			return;
		}
		if (token.type === ParseTreeTokenType.LEAF &&
		token.val.toLowerCase() === symbol)
			result.push(token);
		const children = token.children;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (child.type === ParseTreeTokenType.LEAF && isOfInterest(child))
				i += 2;
			else
				resultFunction(child, result);
		}
	}
	return resultFunction;
}

function processItemReferences(listToken, cachedParseTree, varName, allVariableNames) {
	const itemTokens = [];
	getSymbolReferences('?')(listToken, itemTokens);
	if (itemTokens.length !== 0) {
		const first = getSortedFirstDescendentTokenOf(listToken);
		const makeName = getMakeName(listToken);
		const itemVarName = getDistinctVariableNameAndAddToAll(varName + 'Item', allVariableNames);
		insertColIndexSpanAt(first, 1 + `${makeName} "${itemVarName} item repcount :${varName}`.length);
		const make = new ParseTreeToken(makeName, null, first.lineIndex, first.colIndex + 1,
			ParseTreeTokenType.PARAMETERIZED_GROUP);
		const variableNameString = new ParseTreeToken(itemVarName, null, make.lineIndex,
			make.colIndex + 2 + itemVarName.length,
			ParseTreeTokenType.STRING_LITERAL);
		const itemToken = new ParseTreeToken('item', null, variableNameString.lineIndex, 
			variableNameString.colIndex + 5,
			ParseTreeTokenType.PARAMETERIZED_GROUP);
		const repcountToken = new ParseTreeToken('repcount', null, itemToken.lineIndex, 
			itemToken.colIndex + 9,
			ParseTreeTokenType.PARAMETERIZED_GROUP);
		const variableRead = new ParseTreeToken(varName, null, repcountToken.lineIndex, 
			repcountToken.colIndex + 2 + varName.length,
			ParseTreeTokenType.VARIABLE_READ);
		itemToken.appendChild(repcountToken);
		itemToken.appendChild(variableRead);
		make.appendChild(variableNameString);
		make.appendChild(itemToken);
		first.appendSibling(make);
		for (const itemToken of itemTokens) {
			itemToken.val = itemVarName;
			itemToken.isNeedingSpaceBefore = true;
			itemToken.type = ParseTreeTokenType.VARIABLE_READ;
			cachedParseTree.tokenTypeChanged(itemToken, ParseTreeTokenType.LEAF);
		}
		cachedParseTree.tokensAdded([make, variableNameString, itemToken,
			repcountToken, variableRead]);
	}
}

function processRestReferences(instructionListToken, cachedParseTree, varName, allVariableNames) {
	const restTokens = [];
	getSymbolReferences('?rest')(instructionListToken, restTokens);
	if (restTokens.length !== 0) {
		const first = getSortedFirstDescendentTokenOf(instructionListToken);
		const makeName = getMakeName(instructionListToken);
		const restName = getDistinctVariableNameAndAddToAll(varName + 'Rest', allVariableNames);
		insertColIndexSpanAt(first, 1 + `${makeName} "${restName} sublist :${varName} repcount + 1 count :${varName}`.length);
		const make = new ParseTreeToken(makeName, null, first.lineIndex, first.colIndex + 1,
			ParseTreeTokenType.PARAMETERIZED_GROUP);
		const variableNameString = new ParseTreeToken(restName, null, make.lineIndex,
			make.colIndex + 2 + restName.length,
			ParseTreeTokenType.STRING_LITERAL);
		const sublistToken = new ParseTreeToken('sublist', null, variableNameString.lineIndex, 
			variableNameString.colIndex + 8,
			ParseTreeTokenType.PARAMETERIZED_GROUP);
		const variableRead = new ParseTreeToken(varName, null, sublistToken.lineIndex, 
			sublistToken.colIndex + 2 + varName.length,
			ParseTreeTokenType.VARIABLE_READ);
		const repcountToken = new ParseTreeToken('repcount', null, variableRead.lineIndex, 
			variableRead.colIndex + 9,
			ParseTreeTokenType.PARAMETERIZED_GROUP);
		const plusToken = new ParseTreeToken('+', null, repcountToken.lineIndex, 
			repcountToken.colIndex + 2,
			ParseTreeTokenType.BINARY_OPERATOR);
		const oneToken = new ParseTreeToken(1, null, plusToken.lineIndex, 
			plusToken.colIndex + 2,
			ParseTreeTokenType.NUMBER_LITERAL, '1');
		const countToken = new ParseTreeToken('count', null, oneToken.lineIndex, 
			oneToken.colIndex + 6,
			ParseTreeTokenType.PARAMETERIZED_GROUP);
		const variableRead2 = new ParseTreeToken(varName, null, countToken.lineIndex, 
			countToken.colIndex + 1 + varName.length,
			ParseTreeTokenType.VARIABLE_READ);
		plusToken.appendChild(repcountToken);
		plusToken.appendChild(oneToken);
		sublistToken.appendChild(variableRead);
		sublistToken.appendChild(plusToken);
		sublistToken.appendChild(countToken);
		countToken.appendChild(variableRead2);
		make.appendChild(variableNameString);
		make.appendChild(sublistToken);
		first.appendSibling(make);
		for (const restToken of restTokens) {
			restToken.val = restName;
			restToken.isNeedingSpaceBefore = true;
			restToken.type = ParseTreeTokenType.VARIABLE_READ;
			cachedParseTree.tokenTypeChanged(restToken, ParseTreeTokenType.LEAF);
		}
		cachedParseTree.tokensAdded([make, variableNameString, sublistToken,
			repcountToken, plusToken, oneToken, countToken, variableRead, variableRead2]);
	}
}

function processIndexReferences(instructionListToken, cachedParseTree) {
	const indexTokens = getDescendentsOfType(instructionListToken, ParseTreeTokenType.LEAF).
		filter(t => t.val === '#');
	for (const indexToken of indexTokens) {
		indexToken.val = 'repcount';
		indexToken.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
		cachedParseTree.tokenValueChanged(indexToken, '#');
		cachedParseTree.tokenTypeChanged(indexToken, ParseTreeTokenType.LEAF);
	}
}

export function foreachFixer(cachedParseTree, fixLogger) {
	const foreaches = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	if (foreaches.length === 0)
		return;
	const allVariableNames = getAllVariableNamesSet(cachedParseTree);
	foreaches.forEach(function(foreachToken) {
		const oldVal = foreachToken.val;
		foreachToken.val = 'repeat';
		cachedParseTree.tokenValueChanged(foreachToken, oldVal);
		const listToken = foreachToken.nextSibling;
		const instructionListToken = listToken.nextSibling;
		let varName = listToken.val;
		if (listToken.type !== ParseTreeTokenType.VARIABLE_READ) {
			varName = declareVariableBeforeLoop(listToken, cachedParseTree, allVariableNames);
		}
		addCountTokenAndMakeParameterizedGroup(foreachToken, cachedParseTree);
		processItemReferences(instructionListToken, cachedParseTree, varName, allVariableNames);
		processRestReferences(instructionListToken, cachedParseTree, varName, allVariableNames);
		processIndexReferences(instructionListToken, cachedParseTree);

		fixLogger.log(`Replaced ${oldVal} with repeat loop because WebLogo does not support foreach.`, foreachToken);
	});
};