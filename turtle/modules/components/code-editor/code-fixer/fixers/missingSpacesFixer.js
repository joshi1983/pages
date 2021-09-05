import { Command } from '../../../../parsing/Command.js';
import { DataTypes } from '../../../../parsing/data-types/DataTypes.js';
import { isDigit } from '../../../../isDigit.js';
import { moveArgsForParameterizedGroup } from './helpers/moveArgsForParameterizedGroup.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { Procedure } from '../../../../parsing/Procedure.js';
import { validateIdentifier } from '../../../../parsing/parse-tree-analysis/validateIdentifier.js';
await Command.asyncInit();
await DataTypes.asyncInit();
await ParseTreeToken.asyncInit();

const numbers = new DataTypes('num');
const commandNamesWithNumberFirstArg = new Set(Command.getAllCommandsInfo().filter(function(info) {
	if (info.args.length === 0)
		return false;
	const dataTypes = new DataTypes(info.args[0].types);
	const result = dataTypes.hasIntersectionWith(numbers);
	return result;
}).map(info => info.primaryName));

function hasVariableReference(val) {
	const index = val.indexOf(':');
	if (index === -1)
		return false;
	return validateIdentifier(val.substring(index + 1)) === undefined;
}

function getNumberParameterIndex(val) {
	if (!isDigit(val.charAt(val.length - 1)))
		return -1;
	// Any command or procedure name followed by 
	// a number literal should still be a valid identifier.
	if (validateIdentifier(val) !== undefined)
		return -1;
	let numberString = '';
	for (let i = val.length - 1; i > 0; i--) {
		numberString += val.charAt(i);
		if (isNaN(numberString))
			return -1;
		else {
			const info = Command.getCommandInfo(val.substring(0, i));
			if (info !== undefined && commandNamesWithNumberFirstArg.has(info.primaryName)) {
				return i;
			}
		}
	}
	return -1;
}

function hasNumberParameter(val) {
	return getNumberParameterIndex(val) !== -1;
}

function getMaximumChildren(token) {
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR)
		return 2;
	if (token.type === ParseTreeTokenType.UNARY_OPERATOR)
		return 1;
	if (token.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)
		return 4; // procedure name, parameter list, instruction list, END.
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const commandInfo = Command.getCommandInfo(token.val);
		if (commandInfo !== undefined) {
			const argCount = Command.getArgCount(commandInfo);
			if (argCount.isFlexible)
				return Number.MAX_VALUE;
			return argCount.defaultCount;
		}
		else {
			// For a procedure, we could analyze the tree more to
			// determine its number of parameters.
			// Until then, we'll return MAX_VALUE.
			// It may not match a procedure name and just be a non-existent command too.
			return Number.MAX_VALUE;
		}
	}
	if ([ParseTreeTokenType.TREE_ROOT,
		ParseTreeTokenType.LIST,
		ParseTreeTokenType.CURVED_BRACKET_EXPRESSION].
		indexOf(token.type) !== -1) {
			return Number.MAX_VALUE;
	}
	return 0;
}

function hasMaximumChildren(token) {
	return getMaximumChildren(token) === token.children.length;
}

function getClosestAncestorThatCanGetAnotherSibling(token) {
	while (hasMaximumChildren(token.parentNode))
		token = token.parentNode;
	return token;
}

export function missingSpacesFixer(cachedParseTree, fixLogger) {
	const commaTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).filter(function(token) {
		return (!Procedure.isNameToken(token)) &&
			(hasVariableReference(token.val) || hasNumberParameter(token.val));
	});
	commaTokens.forEach(function(token) {
		if (hasVariableReference(token.val)) {
			const previousVal = token.val;
			const index = previousVal.indexOf(':');
			const varName = previousVal.substring(index + 1);
			const previousColIndex = token.colIndex;
			token.colIndex = previousColIndex - varName.length - 1;
			token.val = token.val.substring(0, index);
			cachedParseTree.tokenValueChanged(token, previousVal);
			const varToken = new ParseTreeToken(varName, null, token.lineIndex, previousColIndex, ParseTreeTokenType.VARIABLE_READ);
			// Avoid adding children to tokens that would definitely have too many children.
			const previousSibling = getClosestAncestorThatCanGetAnotherSibling(token);
			previousSibling.appendSibling(varToken);
			cachedParseTree.tokenAdded(varToken);
			fixLogger.log(`Inserted space in ${previousVal} to separate a variable name ${varName} because a space was needed.`, token);
		}
		else {
			const index = getNumberParameterIndex(token.val);
			const previousColIndex = token.colIndex;
			const previousVal = token.val;
			const numberLiteralString = previousVal.substring(index);
			token.colIndex = previousColIndex - numberLiteralString.length;
			token.val = token.val.substring(0, index);
			cachedParseTree.tokenValueChanged(token, previousVal);
			const numberToken = new ParseTreeToken(parseFloat(numberLiteralString), null, token.lineIndex, 
				previousColIndex, ParseTreeTokenType.NUMBER_LITERAL, numberLiteralString);
			const previousSibling = getClosestAncestorThatCanGetAnotherSibling(token);
			const oldType = token.type;
			token.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
			previousSibling.appendSibling(numberToken);
			cachedParseTree.tokenAdded(numberToken);
			cachedParseTree.tokenTypeChanged(token, oldType);
			const commandInfo = Command.getCommandInfo(token.val);
			const argCount = Command.getArgCount(commandInfo);
			let expectedArgCount = argCount.defaultCount;
			moveArgsForParameterizedGroup(token, expectedArgCount);
			fixLogger.log(`Inserted space in ${previousVal} to separate a number ${numberLiteralString} because a space was needed.`, token);
		}
	});
};