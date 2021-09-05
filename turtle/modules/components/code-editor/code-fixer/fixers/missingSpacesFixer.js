import { Command } from '../../../../parsing/Command.js';
import { DataTypes } from '../../../../parsing/data-types/DataTypes.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { Procedure } from '../../../../parsing/Procedure.js';
import { validateIdentifier } from '../../../../parsing/parse-tree-analysis/validateIdentifier.js';

const numbers = new DataTypes('num');
const commandNamesWithNumberFirstArg = new Set(Command.getAllCommandsInfo().filter(function(info) {
	if (info.args.length === 0)
		return false;
	const dataTypes = new DataTypes(info.args[0].types);
	const result = dataTypes.hasIntersectionWith(numbers);
	return result;
}).map(info => info.primaryName));

function isDigit(char1) {
	return char1 >= '0' && char1 <= '9';
}

function hasVariableReference(val) {
	const index = val.indexOf(':');
	if (index <= 0)
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
			token.appendSibling(varToken);
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
			token.appendSibling(numberToken);
			cachedParseTree.tokenAdded(numberToken);
			fixLogger.log(`Inserted space in ${previousVal} to separate a number ${numberLiteralString} because a space was needed.`, token);
		}
	});
};