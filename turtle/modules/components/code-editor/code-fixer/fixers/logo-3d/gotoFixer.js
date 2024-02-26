import { ParseTreeToken } from '../../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../../parsing/ParseTreeTokenType.js';

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
	const result = new Set(varReadTokens.map(t => t.val.toLowerCase()));
	return result;
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
	const leafs = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF);
	const gotos = leafs.filter(isGotoOfInterest);
	const marks = leafs.filter(isMarkOrOmark);
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
		cachedParseTree.tokenTypeChanged(gotoToken, ParseTreeTokenType.LEAF);
		cachedParseTree.tokenTypeChanged(nameToken, oldNameType);
		cachedParseTree.tokenValueChanged(gotoToken, oldGotoVal);
		fixLogger.log(`Converted call to ${oldGotoVal} to ${gotoToken.val} because that is how we move to a specified location in WebLogo`, gotoToken);
	});
};