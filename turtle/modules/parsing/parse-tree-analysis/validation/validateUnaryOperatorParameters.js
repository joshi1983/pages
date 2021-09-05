import { DataTypes } from '../../data-types/DataTypes.js';
import { getPossibleDataTypesEvaluatedFromToken } from '../getPossibleDataTypesEvaluatedFromToken.js';
import { Operators } from '../../Operators.js';
import { ParseTreeToken } from '../../ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function validateUnaryTokenBasics(token) {
	if (token.children.length !== 1)
		return '1 input is required for unary operator ' + token.val;
	const typesString = Operators.getUnaryParameterTypes(token.val);
	const dataTypes = new DataTypes(typesString);
	if (!dataTypes.mayBeCompatibleWith(token.children[0]))
		return 'The required type is ' + typesString + ' but that is not compatible';
}

function validateUnaryToken(token, proceduresMap) {
	const result = validateUnaryTokenBasics(token);
	if (result !== undefined)
		return result;
	const typesString = Operators.getUnaryParameterTypes(token.val);
	const dataTypes = new DataTypes(typesString);
	const actualTypes = getPossibleDataTypesEvaluatedFromToken(token.children[0], proceduresMap, new Set());
	const actualTypesString = '' + actualTypes;
	actualTypes.intersectWith(dataTypes);
	if (actualTypes.isEmpty())
		return 'The required type is ' + typesString + ' but that is not compatible with the given types.  The given types are ' + actualTypesString;
}

export function validateUnaryOperatorParameters(cachedParseTree, parseLogger) {
	const unaryOperatorTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.UNARY_OPERATOR);
	unaryOperatorTokens.forEach(function(token) {
		const msg = validateUnaryToken(token, cachedParseTree.getProceduresMap());
		if (msg !== undefined)
			parseLogger.error(msg, token);
	});
};