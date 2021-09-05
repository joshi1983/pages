import { dataTypeTokenToString } from
'../../../parsing/parse-tree-analysis/dataTypeTokenToString.js';
import { filterBracketsAndCommas } from
'../helpers/filterBracketsAndCommas.js';
import { isNumericType } from
'../../../parsing/parse-tree-analysis/isNumericType.js';
import { isPossibleData } from
'../../../parsing/isPossibleData.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { processToken } from
'../processToken.js';
import { valueToLiteralCode } from
'../../../../../valueToLiteralCode.js';

const typeValsMap = new Map([
	['Any', 0],
	['Array', []],
	['ArrayBuffer', []],
	['Boolean', false],
	['Char', 'A'],
	['String', ''],
]);

function typeNameToValue(s) {
	if (isNumericType(s))
		return 0;
	const result = typeValsMap.get(s);
	if (result !== undefined)
		return result;
	return 0;
}

function filterToSquareBracketExpression(a) {
	return a.filter(t => 
		t.type === ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION);
}

function getValueToDuplicate(token) {
	let children = filterToSquareBracketExpression(token.children);
	if (children.length === 0) {
		let firstChild = token.children[0];
		if (firstChild.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY)
			firstChild = firstChild.children[firstChild.children.length - 1];
		children = filterToSquareBracketExpression(firstChild.children);
		if (children.length === 0)
			return;
	}
	const e = children[0];
	const dataTypeToken = e.children[1];
	if (dataTypeToken === undefined)
		return;

	const s = dataTypeTokenToString(dataTypeToken);
	return typeNameToValue(s);
}

function getNumberOfDuplicatesToken(token) {
	const children = token.children;
	const argList = children[children.length - 1];
	if (argList === undefined || argList.type !== ParseTreeTokenType.ARG_LIST)
		return;

	const valTokens = filterBracketsAndCommas(argList.children);
	const result = valTokens[0];
	if (result === undefined ||
	result.type === ParseTreeTokenType.STRING_LITERAL ||
	result.type === ParseTreeTokenType.BOOLEAN_LITERAL ||
	!isPossibleData(result))
		return; // the WebLogo translation requires an integer but result won't translate to one.

	return result;
}

export function ofDim(token, result, settings) {
	const val = getValueToDuplicate(token);
	const numDuplicatesToken = getNumberOfDuplicatesToken(token);
	if (val === undefined || numDuplicatesToken === undefined) {
		result.append(' [] ');
		return;
	}	
	result.append(` duplicate ${valueToLiteralCode(val)} `);
	processToken(numDuplicatesToken, result, settings);
};