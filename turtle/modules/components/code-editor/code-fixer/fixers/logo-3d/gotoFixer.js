import { getParseTokensSorted } from '../../../../../parsing/parse-tree-token/getParseTokensSorted.js';
import { insertColIndexSpanAt } from '../../../../../parsing/generic-parsing-utilities/insertColIndexSpanAt.js';
import { ParseTreeToken } from '../../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../../parsing/ParseTreeTokenType.js';
import { removeErroneousNumbersFixer } from './removeErroneousNumbersFixer.js';

const markNameTokenTypes = new Set([
ParseTreeTokenType.LEAF,
ParseTreeTokenType.NUMBER_LITERAL
]);

function isGotoOfInterest(token) {
	if (token.val.toLowerCase() !== 'goto')
		return false;
	const next = token.nextSibling;
	return next !== null && markNameTokenTypes.has(next.type);
}

function isMarkOrOmark(token) {
	const val = token.val.toLowerCase();
	if (val !== 'mark' && val !== 'omark')
		return false;
	const next = token.nextSibling;
	if (next === null || !markNameTokenTypes.has(next.type))
		return false;
	return true;
}

function getVariableNamesLowerCase(cachedParseTree) {
	const varReadTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.VARIABLE_READ);
	return new Set(varReadTokens.map(t => t.val.toLowerCase()));
}

function getSanitizedVariableName(initialVal, existingVariableNames, markVarNameFixMap) {
	if (markVarNameFixMap.has(initialVal))
		return markVarNameFixMap.get(initialVal);
	initialVal = '' + initialVal;
	if (initialVal === '')
		initialVal = 'p' + initialVal;
	const ch = initialVal[0];
	if (ch >= '0' && ch <= '9')
		initialVal = 'v' + initialVal;
	if (!existingVariableNames.has(initialVal.toLowerCase()))
		return initialVal;
	for (let i = 1; true; i++) {
		const newName = initialVal + i;
		if (!existingVariableNames.has(newName.toLowerCase()))
			return newName;
	}
}

export function gotoFixer(cachedParseTree, fixLogger) {
	removeErroneousNumbersFixer(cachedParseTree, fixLogger);
	const leafs = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF);
	const gotos = leafs.filter(isGotoOfInterest);
	const marks = leafs.filter(isMarkOrOmark);
	if (marks.length === 0 && gotos.length === 0)
		return;
	const tokens = cachedParseTree.getAllTokens();
	getParseTokensSorted(tokens);
	function insertGapAfter(beforeToken) {
		const tokenIndex = tokens.indexOf(beforeToken);
		const lineIndex = beforeToken.lineIndex;
		for (let i = tokenIndex + 1; i < tokens.length; i++) {
			const token = tokens[i];
			if (token.lineIndex > lineIndex)
				break;
			token.colIndex ++;
		}
	}
	const nameTypeMap = new Map();
	const existingVariableNames = getVariableNamesLowerCase(cachedParseTree);
	const markVarNameFixMap = new Map();
	marks.forEach(function(markToken) {
		const oldVal = markToken.val.toLowerCase();
		const varNameToken = markToken.nextSibling;
		const oldVarNameType = varNameToken.type;
		const oldVarNameValue = varNameToken.val;
		const fixedVarName = getSanitizedVariableName(oldVarNameValue, existingVariableNames, markVarNameFixMap);
		markVarNameFixMap.set(oldVarNameValue, fixedVarName);
		existingVariableNames.add(fixedVarName.toLowerCase());
		markToken.val = 'make';
		markToken.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
		varNameToken.type = ParseTreeTokenType.STRING_LITERAL;
		varNameToken.val = fixedVarName;
		varNameToken.originalString = undefined;
		varNameToken.remove();
		markToken.appendChild(varNameToken);
		cachedParseTree.tokenTypeChanged(markToken, ParseTreeTokenType.LEAF);
		cachedParseTree.tokenTypeChanged(varNameToken, oldVarNameType);
		if (fixedVarName !== oldVarNameValue) {
			cachedParseTree.tokenValueChanged(varNameToken, oldVarNameValue);
		}
		let cmdName;
		if (oldVal === 'mark')
			cmdName = 'pos';
		else
			cmdName = 'turtleState';
		insertGapAfter(varNameToken);
		const posToken = new ParseTreeToken(cmdName, null, varNameToken.lineIndex, varNameToken.colIndex + 1, ParseTreeTokenType.PARAMETERIZED_GROUP);
		markToken.appendChild(posToken);
		cachedParseTree.tokenAdded(posToken);
		fixLogger.log(`Converted ${oldVal} to make "${varNameToken.val} ${cmdName} because that is how WebLogo stores positions`, markToken);
		nameTypeMap.set(varNameToken.val, cmdName);
	});
	gotos.forEach(function(gotoToken) {
		const oldGotoVal = gotoToken.val;
		const nameToken = gotoToken.nextSibling;
		const oldNameType = nameToken.type;
		nameToken.type = ParseTreeTokenType.VARIABLE_READ;
		nameToken.originalString = undefined;
		if (markVarNameFixMap.has(nameToken.val)) {
			const oldNameVal = nameToken.val;
			nameToken.val = markVarNameFixMap.get(nameToken.val);
			if (oldNameVal !== nameToken.val)
				cachedParseTree.tokenValueChanged(nameToken, oldNameVal);
		}
		if (nameTypeMap.get(nameToken.val) === 'pos')
			gotoToken.val = 'jumpTo';
		else
			gotoToken.val = 'setTurtleState';
		gotoToken.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
		nameToken.remove();
		gotoToken.appendChild(nameToken);
		insertColIndexSpanAt(gotoToken, gotoToken.val.length - 'goto'.length);
		cachedParseTree.tokenTypeChanged(gotoToken, ParseTreeTokenType.LEAF);
		cachedParseTree.tokenTypeChanged(nameToken, oldNameType);
		cachedParseTree.tokenValueChanged(gotoToken, oldGotoVal);
		fixLogger.log(`Converted call to ${oldGotoVal} to ${gotoToken.val} because that is how we move to a specified location in WebLogo`, gotoToken);
	});
};