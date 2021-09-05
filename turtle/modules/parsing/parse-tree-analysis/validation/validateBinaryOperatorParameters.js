import { DataTypes } from '../../data-types/DataTypes.js';
import { getTokensByType } from '../cached-parse-tree/getTokensByType.js';
import { Operators } from '../../Operators.js';
import { ParseTreeToken } from '../../ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function validateBinaryOperatorTokenBasics(token, cachedParseTree) {
	if (token.children.length !== 2)
		return '2 inputs are required for binary operator ' + token.val;
	const info = Operators.getOperatorInfo(token.val);
	if (info === undefined)
		return 'Unrecognized operator symbol: ' + token.val;
	else {
		for (let i = 0; i < 2; i++) {
			const typeString = Operators.getParameterTypes(info, i);
			const requiredTypes = new DataTypes(typeString);
			const actualTokenTypes = cachedParseTree.getPossibleTypesFromToken(token.children[i]);
			if (!requiredTypes.hasIntersectionWith(actualTokenTypes)) {
				const prefix = ['First', 'Second'][i];
				return prefix + ' operand for operator ' + token.val + ' must be of type ' + typeString + '.';
			}
		}
	}
}

function validateBinaryOperatorToken(token, cachedParseTree) {
	const proceduresMap = cachedParseTree.getProceduresMap();
	const result = validateBinaryOperatorTokenBasics(token, cachedParseTree);
	if (result !== undefined)
		return result;
	const info = Operators.getOperatorInfo(token.val);
	for (let i = 0; i < 2; i++) {
		const typeString = Operators.getParameterTypes(info, i);
		const types = new DataTypes(typeString);
		const actualTypes = cachedParseTree.getPossibleTypesFromToken(token.children[i]);
		const actualTypesString = actualTypes.toString();
		actualTypes.intersectWith(types);
		if (actualTypes.isEmpty()) {
			const prefix = ['First', 'Second'][i];
			let result = prefix + ' operand for operator ' + token.val + ' must be of type ' + typeString + '. ';
			if (actualTypesString === '')
				result += 'We could not determine any data type that fits the expression you provided.';
			else
				result += 'The type(s) provided were narrowed down to ' + actualTypesString;
			return result;
		}
	}
};

function validateDivisionOperator(cachedParseTree, token, parseLogger) {
	const tokenValues = cachedParseTree.getTokenValues();
	const numeratorValue = tokenValues.get(token.children[0]);
	const denominatorValue = tokenValues.get(token.children[1]);
	if (denominatorValue === 0) {
		if (numeratorValue === 0)
			parseLogger.warn('0/0 is indeterminate which will most-likely cause problems when using this calculated value', token);
		else if (numeratorValue !== undefined)
			parseLogger.warn(`${numeratorValue}/0 is infinite which will most-likely cause problems when using this calculated value`, token);
		else
			parseLogger.warn('Dividing by 0 will most-likely cause problems when using this calculated value', token);
	}
}

export function validateBinaryOperatorParameters(cachedParseTree, parseLogger) {
	getTokensByType(cachedParseTree, ParseTreeTokenType.BINARY_OPERATOR).forEach(function(token) {
		const msg = validateBinaryOperatorToken(token, cachedParseTree);
		if (msg !== undefined)
			parseLogger.error(msg, token);
		else if (token.val === '/')
			validateDivisionOperator(cachedParseTree, token, parseLogger);
	});
};