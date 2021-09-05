import { Command } from
'../../../Command.js';
import { filterBracketsAndCommas } from
'./helpers/filterBracketsAndCommas.js';
import { methodCallTokenToArgTypes } from
'./method-calls/methodCallTokenToArgTypes.js';
import { methodCallTokenToClassName } from
'./method-calls/methodCallTokenToClassName.js';
import { processArgumentsAsSingleColor } from './method-calls/processArgumentsAsSingleColor.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { ProcessingMethod } from '../../ProcessingMethod.js';
import { processSpecialMethodCall } from './method-calls/processSpecialMethodCall.js';
import { processToken } from './processToken.js';
await Command.asyncInit();

function getArgCount(methodInfo, argTokens) {
	let argCount1 = methodInfo.argCount;
	if (methodInfo.to !== undefined) {
		const info = Command.getCommandInfo(methodInfo.to);
		argCount1 = info.args.length;
	}
	if (Number.isInteger(argCount1) &&
	methodInfo.ignoreExtraParameters === true &&
	argCount1 < argTokens.length)
		return argCount1;
	return argTokens.length;
}

function shouldWrapInBrackets(methodCall, methodInfo) {
	if (methodInfo !== undefined) {
		if (methodInfo.removeInMigration === true ||
		methodInfo.returnType === 'void')
			return false;
	}
	
	const parent = methodCall.parentNode;
	return parent.type !== ParseTreeTokenType.CODE_BLOCK ||
		parent.type !== ParseTreeTokenType.TREE_ROOT;
}

function getNestedNameToken(token) {
	let tok = token;
	while (tok.children.length !== 0) {
		let prevTok = tok;
		if (tok.type === ParseTreeTokenType.EXPRESSION_DOT &&
		tok.children.length === 2)
			tok = tok.children[1];
		if (tok.type === ParseTreeTokenType.DOT &&
		tok.children.length === 1)
			tok = tok.children[0];

		if (prevTok === tok)
			break;
	}
	return tok;
}

function processDotPathAsParameters(nameToken, result, settings) {
	if (nameToken.type === ParseTreeTokenType.DOT &&
	nameToken.children.length !== 0)
		nameToken = nameToken.children[0];

	const children = nameToken.children;
	if (children.length === 0)
		return;
	if (nameToken.type === ParseTreeTokenType.EXPRESSION_DOT &&
	children.length !== 0) {
		const child = nameToken.children[0];
		if (child.type === ParseTreeTokenType.IDENTIFIER)
			result.append(':' + child.val + ' ');
		if (children.length === 2)
			processDotPathAsParameters(children[1], result, settings);
	}
}

export function processMethodCall(token, result, settings) {
	if (processSpecialMethodCall(token, result, settings))
		return;
	const children = token.children;
	if (children.length === 2) {
		const nameToken = children[0];
		const args = children[1];
		const argTokens = filterBracketsAndCommas(args.children);
		const argCount = argTokens.length;
		const className = methodCallTokenToClassName(token);
		const argTypes = methodCallTokenToArgTypes(token, settings.cachedParseTree);
		const methodInfo = ProcessingMethod.getMethodInfo(nameToken.val, className, argCount, argTypes);
		let numArgs = argCount;
		const wrapInBrackets = shouldWrapInBrackets(token, methodInfo);
		if (wrapInBrackets)
			result.append(' ( ');

		if (methodInfo === undefined) {
			const nestedNameToken = getNestedNameToken(nameToken);
			result.append(' ' + nestedNameToken.val + ' ');
			processDotPathAsParameters(nameToken, result, settings);
		}
		else {
			// is methodInfo.to set?  
			// else is methodInfo.toProc set?
			const name = methodInfo.to !== undefined ? methodInfo.to : methodInfo.toProc;
			if (methodInfo.removeInMigration === true)
				return;
			else {
				if (name !== undefined) {
					result.append(' ' + name + ' ');
				}
				if (methodInfo.translateAllParametersToSingleColor === true) {
					processArgumentsAsSingleColor(argTokens, result, settings);
					return;
				}
				else {
					numArgs = getArgCount(methodInfo, argTokens);
				}
			}
		}
		if (!Number.isInteger(numArgs))
			numArgs = argTokens.length;
		for (let i = 0; i < numArgs; i++) {
			const child = argTokens[i];
			processToken(child, result, settings);
			result.append(' ');
		}
		if (wrapInBrackets)
			result.append(' ) ');
	}
};