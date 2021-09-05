import { declarationToTypeName } from
'../../parsing/parse-tree-analysis/variable-data-types/declarationToTypeName.js';
import { duplicate } from
'../../../../../command-groups/helpers/duplicate.js';
import { evaluateToken } from
'../../evaluation/evaluateToken.js';
import { stopDescentTypes } from
'../../parsing/parse-tree-analysis/variable-data-types/variables/addVariablesFromDims.js';
import { getMakeCommandNameForToken } from
'./helpers/getMakeCommandNameForToken.js';
import { mightBeDataValue } from
'../../parsing/parse-tree-analysis/variable-data-types/mightBeDataValue.js';
import { numberNames } from
'../../parsing/parse-tree-analysis/variable-data-types/numberNames.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from
'./processToken.js';
import { valueToLiteralCode } from
'../../../../../valueToLiteralCode.js';

function getPotentialVariableNames(token, options, namesMap) {
	if (token.type === ParseTreeTokenType.IDENTIFIER) {
		const variableName = options.identifierRenameMap.get(token.val.toLowerCase());
		namesMap.set(variableName, token);
	}
	if (stopDescentTypes.has(token.type))
		return;
	for (const child of token.children) {
		getPotentialVariableNames(child, options, namesMap);
	}
}

function getCustomTypeNameForToken(token) {
	const name = declarationToTypeName(token);
	if (name !== undefined)
		return name;
	let next = token.getNextSibling();
	if (next === null || next.type === ParseTreeTokenType.COMMA || next.type === ParseTreeTokenType.IDENTIFIER)
		return;
	if (next.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION ||
	next.type === ParseTreeTokenType.TUPLE_LITERAL)
		next = next.getNextSibling();
	if (next === null)
		return;
	if (next.type === ParseTreeTokenType.AS) {
		let child = next.children[0];
		if (child === undefined)
			return;
		if (child.type === ParseTreeTokenType.DATA_TYPE)
			child = child.children[0];
		if (child === undefined)
			return;
		if (child.type === ParseTreeTokenType.IDENTIFIER)
			return child.val.toLowerCase();
	}
}

function isDeclaringAnArray(token) {
	token = token.getNextSibling();
	if (token === null || token.type === ParseTreeTokenType.AS)
		return false;
	if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION ||
	token.type === ParseTreeTokenType.TUPLE_LITERAL)
		return true;
	return false;
}

function typeToInitValue(token) {
	if (token === undefined)
		return [];
	if (token.type === ParseTreeTokenType.DATA_TYPE) {
		token = token.children[0];
		if (token === undefined)
			return;
	}
	if (token.type === ParseTreeTokenType.IDENTIFIER) {
		const name = token.val.toLowerCase();
		if (name === 'string')
			return '';
		else if (numberNames.has(name))
			return 0;
		else
			return;
	}
	return [];
}

function asToInitVal(asToken) {
	const child = asToken.children[0];
	return typeToInitValue(child);
}

function getInitialValueForToken(token) {
	if (token === undefined)
		return;
	let next = token.getNextSibling();
	if (next === null)
		return;
	const typeName = declarationToTypeName(token);
	if (numberNames.has(typeName))
		return 0;
	else if (typeName === 'string')
		return '';
	let arrayLen = 0;
	let isArray = false;
	if (next.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
		isArray = true;
		const children = next.children.filter(mightBeDataValue);
		if (children.length === 1) {
			const onlyChild = children[0];
			let val;
			if (onlyChild.type === ParseTreeTokenType.BINARY_OPERATOR &&
			onlyChild.val.toLowerCase() === 'to' &&
			onlyChild.children.length === 2) {
				const from = onlyChild.children[0];
				const to = onlyChild.children[1];
				const fromVal = evaluateToken(from);
				const toVal = evaluateToken(to);
				if (Number.isInteger(fromVal) && Number.isInteger(toVal))
					val = toVal + 1 - fromVal;
			}
			else
				val = evaluateToken(onlyChild);

			if (Number.isInteger(val) && val >= 0)
				arrayLen = val;
			else
				return;
		}
		next = next.getNextSibling();
		if (next === null)
			return;
	}
	if (next.type === ParseTreeTokenType.AS) {
		const val = asToInitVal(next);
		if (val === undefined)
			return;
		if (isArray)
			return duplicate(val, arrayLen);
		else
			return val;
	}
	let after = token;
	for (after = after.getNextSibling();
		after !== null &&
		after.lineIndex === token.lineIndex;
		after = after.getNextSibling()) {
		if (after.type !== ParseTreeTokenType.IDENTIFIER)
			continue;
		const afterNext = after.getNextSibling();
		if (afterNext === null ||
		afterNext.type === ParseTreeTokenType.AS)
			break;
	}
	if (after !== null) {
		const afterNext = after.getNextSibling();
		if (afterNext !== null && afterNext.type === ParseTreeTokenType.AS) {
			const val = asToInitVal(afterNext);
			if (isArray)
				return duplicate(val, arrayLen);
			else
				return val;
		}
	}
	return [];
}

function processArrayLengthExpression(token, result, options) {
	const arrayDimensionsToken = token.getNextSibling();
	const children = arrayDimensionsToken.children.filter(mightBeDataValue);
	if (children.length === 1) {
		const only = children[0];
		if (only.type === ParseTreeTokenType.BINARY_OPERATOR &&
		only.val.toLowerCase() === 'to' &&
		only.children.length === 2) {
			const from = only.children[0];
			const to = only.children[1];
			const fromVal = evaluateToken(from);
			const toVal = evaluateToken(to);
			processToken(to, result, options);
			if (fromVal !== 1) {
				if (Number.isInteger(fromVal))
					result.append(` - ${fromVal - 1}`);
				else {
					result.append(' + 1 - ( ');
					processToken(from, result, options);
					result.append(' )');
				}
			}
		}
		else
			processToken(only, result, options);
	}
}

export function processDim(token, result, options) {
	result.processCommentsUpToToken(token);
	const makeCommand = getMakeCommandNameForToken(token);
	const nameToTokenMap = new Map();
	getPotentialVariableNames(token, options, nameToTokenMap);
	const sortedNames = Array.from(nameToTokenMap.keys());
	sortedNames.sort();
	for (const variableName of sortedNames) {
		const token = nameToTokenMap.get(variableName);
		const initVal = getInitialValueForToken(token);
		result.append(`\n${makeCommand} "${variableName} `);
		if (initVal === undefined) {
			const typeName = getCustomTypeNameForToken(token);
			const createProcName = options.typeToCreateProcName.get(typeName);
			const makeArray = isDeclaringAnArray(token);
			if (makeArray && createProcName !== undefined) {
				result.append('initializeList ');
				processArrayLengthExpression(token, result, options);
			}
			if (createProcName === undefined) {
				if (makeArray)
					result.append('[]');
				else
					result.append('createPList');
			}
			else {
				if (makeArray)
					result.append('"');
				result.append(createProcName);
			}
		}
		else
			result.append(valueToLiteralCode(initVal));
		result.append('\n');
	}
};