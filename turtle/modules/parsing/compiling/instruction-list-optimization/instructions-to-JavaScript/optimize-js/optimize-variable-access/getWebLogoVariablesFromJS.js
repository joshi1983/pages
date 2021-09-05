import { evaluateStringLiteral } from '../../../../../js-parsing/evaluateStringLiteral.js';
import { getWebLogoVariableNameFromVariableReference } from './getWebLogoVariableNameFromVariableReference.js';
import { isAfterOrSame } from '../../../../../generic-parsing-utilities/isAfterOrSame.js';
import { isGlobalVariablesSetCall } from '../token-classifiers/isGlobalVariablesSetCall.js';
import { isIdentifierReadToken } from '../token-classifiers/isIdentifierReadToken.js';
import { isJSVariableAssignment } from '../token-classifiers/isJSVariableAssignment.js';
import { isJSVariableDeclareAssignment } from '../token-classifiers/isJSVariableDeclareAssignment.js';
import { isLocalVariablesSetCall } from '../token-classifiers/isLocalVariablesSetCall.js';
import { isReadWriteReference } from '../token-classifiers/isReadWriteReference.js';
import { isWebLogoVariableAlwaysLocal } from './isWebLogoVariableAlwaysLocal.js';
import { isWebLogoVariableAlwaysLocalAtEnd } from './isWebLogoVariableAlwaysLocalAtEnd.js';
import { isVariableAssignment } from '../token-classifiers/isVariableAssignment.js';
import { isVariableReadToken } from '../token-classifiers/isVariableReadToken.js';
import { MaybeDecided } from '../../../../../../MaybeDecided.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';
import { WebLogoVariableInfo } from './WebLogoVariableInfo.js';

function isSetCall(token) {
	return isGlobalVariablesSetCall(token) ||
		isLocalVariablesSetCall(token);
}

function getWebLogoVariableNameFromAssignToken(assignToken) {
	const funcCall = assignToken.parentNode.children[1];
	if (funcCall.type !== ParseTreeTokenType.FUNCTION_CALL)
		throw new Error(`Expected a FUNCTION_CALL but got ${ParseTreeTokenType.getNameFor(funcCall.type)}`);
	const argList = funcCall.children[1];
	if (argList.type !== ParseTreeTokenType.ARG_LIST)
		throw new Error(`Expected an ARG_LIST but got ${ParseTreeTokenType.getNameFor(argList.type)}`);
	return evaluateStringLiteral(argList.children[1].val);
}

function getWebLogoVariableNameFrom(readToken, variables) {
	let jsName = readToken.val;
	if (readToken.type === ParseTreeTokenType.STRING_LITERAL || readToken.type === ParseTreeTokenType.TEMPLATE_LITERAL)
		jsName = evaluateStringLiteral(jsName);
	if (isSetCall(readToken)) {
		return evaluateStringLiteral(readToken.children[1].children[1].val);
	}
	const possibleMatches = [];
	for (const [key, info] of variables) {
		if (info.jsVarNames.has(jsName))
			possibleMatches.push(info);
	}
	if (possibleMatches.length > 1) {
		const newPossibleMatches = [];
		for (let i = 0; i < possibleMatches.length; i++) {
			const firstAssignToken = possibleMatches[i].getFirstAssignToken();
			if (isAfterOrSame(readToken, firstAssignToken)) {
				newPossibleMatches.push(possibleMatches[i]);
			}
		}
		if (newPossibleMatches.length !== 0)
			possibleMatches = newPossibleMatches;
	}
	if (possibleMatches.length === 1)
		return possibleMatches[0].name;
}

function isAlwaysGlobal(info) {
	const isAlwaysLocal = info.isAlwaysLocal;
	if (isAlwaysLocal === MaybeDecided.Yes)
		return MaybeDecided.No;
	return MaybeDecided.Maybe;
}

/*
Similar to getVariableCountsFromParseTree in that getVariableCountsFromParseTree 
also gets variable reference information out of JavaScript code.

Different in that getWebLogoVariabelsFromJS assumes JavaScript variables may already be representing some of the WebLogo variables.
*/
export function getWebLogoVariablesFromJS(allTokens) {
	const jsVariableDeclareAssignments = allTokens.filter(isJSVariableDeclareAssignment);
	const jsVariableAssignments = allTokens.filter(t => !isJSVariableDeclareAssignment(t) && isJSVariableAssignment(t));
	const variableAssignments = allTokens.filter(isVariableAssignment);
	const identifiers = allTokens.filter(isIdentifierReadToken);
	const varReads = allTokens.filter(isVariableReadToken);
	const setCalls = allTokens.filter(isSetCall);
	const varReferences = allTokens.filter(isReadWriteReference);
	const result = new Map();
	jsVariableDeclareAssignments.forEach(function(assignToken) {
		const name = getWebLogoVariableNameFromAssignToken(assignToken);
		let info = result.get(name);
		if (info === undefined) {
			info = new WebLogoVariableInfo(name, assignToken);
			result.set(name, info);
		}
		else {
			info.handleAssignToken(assignToken);
		}
	});
	jsVariableAssignments.forEach(function(assignToken) {
		const webLogoVarName = assignToken.val;
		const info = result.get(webLogoVarName);
		if (info !== undefined) {
			info.handleAssignToken(assignToken);
		}
	});
	variableAssignments.forEach(function(assignToken) {
		const webLogoVarName = getWebLogoVariableNameFrom(assignToken, result);;
		const info = result.get(webLogoVarName);
		if (info !== undefined) {
			info.makeTokens.push(assignToken);
		}
	});
	identifiers.forEach(function(identifierToken) {
		const webLogoVarName = getWebLogoVariableNameFrom(identifierToken, result);
		if (webLogoVarName === undefined)
			return;
		const info = result.get(webLogoVarName);
		if (info !== undefined) {
			info.readTokens.push(identifierToken);
		}
	});
	varReads.forEach(function(varReadToken) {
		const webLogoVarName = getWebLogoVariableNameFrom(varReadToken, result);
		if (webLogoVarName === undefined)
			return;
		const info = result.get(webLogoVarName);
		if (info !== undefined) {
			info.readTokens.push(varReadToken);
		}
	});
	varReferences.forEach(function(varReference) {
		const webLogoVarName = getWebLogoVariableNameFromVariableReference(varReference);
		if (webLogoVarName === undefined)
			return;
		const info = result.get(webLogoVarName);
		if (info !== undefined) {
			info.varReferences.push(varReference);
		}
	});
	setCalls.forEach(function(setCallToken) {
		const webLogoVarName = getWebLogoVariableNameFrom(setCallToken);
		if (webLogoVarName === undefined)
			return;
		let info = result.get(webLogoVarName);
		if (info === undefined) {
			info = new WebLogoVariableInfo(webLogoVarName);
			result.set(webLogoVarName, info);
		}
		info.setTokens.push(setCallToken);
	});
	for (const info of result.values()) {
		info.isAlwaysLocalAtEnd = isWebLogoVariableAlwaysLocalAtEnd(info);
		info.isAlwaysLocal = isWebLogoVariableAlwaysLocal(info);
		info.isAlwaysGlobal = isAlwaysGlobal(info);
	}
	return result;
};