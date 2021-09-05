import { duplicate } from
'../../../../../command-groups/helpers/duplicate.js';
import { evaluateDataTypesAdvanced } from
'./evaluateDataTypesAdvanced.js';
import { filterBracketsAndCommas } from
'../../../translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { getClosestOfType } from
'../../../../generic-parsing-utilities/getClosestOfType.js';
import { getTokensByType } from
'../../../../generic-parsing-utilities/getTokensByType.js';
import { getTypeFromValue } from
'./getTypeFromValue.js';
import { isPropertyToken } from './isPropertyToken.js';
import { methodCallTokenToClassName } from
'../../../translation-to-weblogo/type-processors/method-calls/methodCallTokenToClassName.js';
import { newChildTokenToDataTypeString } from
'./newChildTokenToDataTypeString.js';
import { ProcessingIdentifiers } from
'../../../ProcessingIdentifiers.js';
import { Operators } from
'../../../Operators.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { ProcessingMethod } from
'../../../ProcessingMethod.js';

function evaluateTypesFromValues(cachedParseTree, result) {
	const tokenValues = cachedParseTree.getTokenValues();
	for (const [token, value] of tokenValues) {
		result.set(token, getTypeFromValue(value));
	}
}

function isVariableReadToken(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.DOT ||
	parent.type === ParseTreeTokenType.DECLARATION ||
	parent.type === ParseTreeTokenType.METHOD_CALL ||
	parent.type === ParseTreeTokenType.METHOD)
		return false;
	if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
		const index = parent.children.indexOf(token);
		if (index === 0)
			return false; 
			// a value is assigned to the variable represented by token.
			// The assigning of the value is not a variable read.
	}
	return true;
}

function evaluateVariableReadTokenTypes(cachedParseTree, result) {
	const variables = cachedParseTree.getVariables();
	const identifierTokens = getTokensByType(cachedParseTree, ParseTreeTokenType.IDENTIFIER).
		filter(isVariableReadToken);
	for (const idToken of identifierTokens) {
		const variable = variables.get(idToken.val);
		if (variable === undefined)
			continue;
		const method = cachedParseTree.getMethodAtToken(idToken);
		const scope = variable.getScopeAt(idToken, method);
		if (scope !== undefined) {
			result.set(idToken, scope.dataTypeToString());
		}
	}
}

function evaluateTypesFromIdentifiers(cachedParseTree, result) {
	const identifierTokens = getTokensByType(cachedParseTree, ParseTreeTokenType.IDENTIFIER);
	for (const token of identifierTokens) {
		const isProperty = isPropertyToken(token);
		const info = ProcessingIdentifiers.getIdentifierInfo(token.val, isProperty);
		if (info !== undefined && info.type !== undefined) {
			let tok = token;
			if (isProperty)
				tok = getClosestOfType(token, ParseTreeTokenType.EXPRESSION_DOT);
			result.set(tok, info.type);
		}
	}
}

function evaluateTypesFromBinaryOperators(cachedParseTree, result) {
	const operatorTokens = getTokensByType(cachedParseTree, ParseTreeTokenType.BINARY_OPERATOR).
		filter(t => Operators.getOperatorInfo(t.val).returnType !== undefined);
	for (const binaryOperator of operatorTokens) {
		const info = Operators.getOperatorInfo(binaryOperator.val);
		result.set(binaryOperator, info.returnType);
	}
}

function evaluateTypesFromNew(cachedParseTree, result) {
	const newTokens = getTokensByType(cachedParseTree, ParseTreeTokenType.NEW);
	for (const newToken of newTokens) {
		const children = newToken.children;
		if (children.length === 1) {
			const child = children[0];
			const typeStr = newChildTokenToDataTypeString(child);
			if (typeStr !== undefined) {
				result.set(newToken, typeStr);
			}
		}
	}
}

function evaluateTypesFromUnaryOperators(cachedParseTree, result) {
	const operatorTokens = getTokensByType(cachedParseTree, ParseTreeTokenType.UNARY_OPERATOR).
		filter(t => Operators.getOperatorInfo(t.val).returnType !== undefined);
	for (const unaryOperator of operatorTokens) {
		const info = Operators.getOperatorInfo(unaryOperator.val);
		result.set(unaryOperator, info.returnType);
	}
}

function evaluateTypesFromMethodCalls(cachedParseTree, result) {
	const tokens = getTokensByType(cachedParseTree, ParseTreeTokenType.METHOD_CALL);
	for (const methodCall of tokens) {
		if (methodCall.children.length < 2)
			continue;
		const name = methodCall.children[0].val;
		const argList = methodCall.children[1];
		if (typeof name !== 'string')
			continue;
		const args = filterBracketsAndCommas(argList.children);
		const argCount = args.length;
		const className = methodCallTokenToClassName(methodCall);
		const argTypes = duplicate('*', argCount);
		const info = ProcessingMethod.getMethodInfo(name, className, argCount, argTypes);
		if (info !== undefined && typeof info.returnType === 'string')
			result.set(methodCall, info.returnType);
	}
}

export function analyzeTokenDataTypes(cachedParseTree) {
	const result = new Map();
	evaluateTypesFromIdentifiers(cachedParseTree, result);
	evaluateTypesFromNew(cachedParseTree, result);
	evaluateTypesFromValues(cachedParseTree, result);
	evaluateVariableReadTokenTypes(cachedParseTree, result);
	evaluateTypesFromBinaryOperators(cachedParseTree, result);
	evaluateTypesFromUnaryOperators(cachedParseTree, result);
	evaluateTypesFromMethodCalls(cachedParseTree, result);
	evaluateDataTypesAdvanced(cachedParseTree, result);
	return result;
};