import { evaluateStringLiteral } from '../../../../../js-parsing/evaluateStringLiteral.js';
import { flatten } from '../../../../../generic-parsing-utilities/flatten.js';
import { getParseTokensSorted } from
'../../../../../parse-tree-token/getParseTokensSorted.js';
import { getWebLogoVariableNameFromVariableReference } from './getWebLogoVariableNameFromVariableReference.js';
import { isContextGlobalVariableRead } from '../token-classifiers/isContextGlobalVariableRead.js';
import { isGlobalVariablesGetCall } from '../token-classifiers/isGlobalVariablesGetCall.js';
import { isGlobalVariablesSetCall } from '../token-classifiers/isGlobalVariablesSetCall.js';
import { isLocalVariableRead } from '../token-classifiers/isLocalVariableRead.js';
import { isLocalVariablesGetCall } from '../token-classifiers/isLocalVariablesGetCall.js';
import { isLocalVariablesSetCall } from '../token-classifiers/isLocalVariablesSetCall.js';
import { isLocalmakeAssignment } from '../token-classifiers/isLocalmakeAssignment.js';
import { isMakeAssignment } from '../token-classifiers/isMakeAssignment.js';
import { isNoContextGlobalVariableRead } from '../token-classifiers/isNoContextGlobalVariableRead.js';
import { isReadWriteReference } from '../token-classifiers/isReadWriteReference.js';
import { isScopeAgnosticVariableRead } from '../token-classifiers/isScopeAgnosticVariableRead.js';
import { isVariableAssignment } from '../token-classifiers/isVariableAssignment.js';
import { isVariableCountsVariableInfoAlwaysLocalAtEnd } from './isVariableCountsVariableInfoAlwaysLocalAtEnd.js';
import { isVariableReadToken } from '../token-classifiers/isVariableReadToken.js';
import { MaybeDecided } from '../../../../../../MaybeDecided.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

// Very similar to what WebLogoVariableInfo represents.
// We might want to merge VariableInfo with WebLogoVariableInfo eventually.
class VariableInfo {
	constructor() {
		this.isAlwaysLocal = undefined;
		this.isAlwaysGlobal = undefined;
		this.readTokens = [];
		this.writeTokens = [];
		this.varReferences = [];
	}
}

function updateIsAlwaysLocal(varInfo, isForProcedure) {
	if (isForProcedure === false) {
		/* only global variables can exist outside of procedures so
		the calculation is trivial for this case. */
		varInfo.isAlwaysLocal = MaybeDecided.No;
		varInfo.isAlwaysGlobal = MaybeDecided.Yes;
		varInfo.isAlwaysLocalAtEnd = MaybeDecided.No;
		return;
	}
	const tokens = varInfo.readTokens.concat(varInfo.writeTokens);
	getParseTokensSorted(tokens);
	let t = tokens[0];
	if (isLocalVariableRead(t) || isLocalmakeAssignment(t) ||
	isLocalVariablesSetCall(t) || isLocalVariablesGetCall(t)) {
		varInfo.isAlwaysLocal = MaybeDecided.Yes;
		varInfo.isAlwaysGlobal = MaybeDecided.No;
	}
	else if (isContextGlobalVariableRead(t) || isNoContextGlobalVariableRead(t) ||
	isGlobalVariablesSetCall(t) || isGlobalVariablesGetCall(t)) {
		varInfo.isAlwaysLocal = MaybeDecided.No;
		varInfo.isAlwaysGlobal = MaybeDecided.Yes;
	}
	else if (isScopeAgnosticVariableRead(t) || isMakeAssignment(t)) {
		varInfo.isAlwaysLocal = MaybeDecided.Maybe;
		varInfo.isAlwaysGlobal = MaybeDecided.Maybe;
	}
	else {
		varInfo.isAlwaysLocal = MaybeDecided.Maybe;
		varInfo.isAlwaysGlobal = MaybeDecided.Maybe;
	}
	for (let i = 1; i < tokens.length; i++) {
		t = tokens[i];
		if (isContextGlobalVariableRead(t) || isNoContextGlobalVariableRead(t)) {
			varInfo.isAlwaysLocal = MaybeDecided.No;
		}
		else if (isScopeAgnosticVariableRead(t) || isMakeAssignment(t)) {
			// no change to make
		}
		else if (isLocalVariableRead(t) || isLocalmakeAssignment(t)) {
			varInfo.isAlwaysGlobal = MaybeDecided.No;
		}
		else {
		}
	}
	if (varInfo.isAlwaysLocal === MaybeDecided.Yes)
		varInfo.isAlwaysGlobal = MaybeDecided.No;
	varInfo.isAlwaysLocalAtEnd = isVariableCountsVariableInfoAlwaysLocalAtEnd(varInfo);
}

export function getVariableCountsFromParseTree(rootToken, isForProcedure) {
	const allTokens = flatten(rootToken);
	const variableReadTokens = allTokens.filter(isVariableReadToken);
	const variableAssignments = allTokens.filter(isVariableAssignment);
	const variableReferences = allTokens.filter(isReadWriteReference);
	const variables = new Map();
	variableReadTokens.forEach(function(variableReadToken) {
		const variableName = evaluateStringLiteral(variableReadToken.val);
		let obj = variables.get(variableName);
		if (obj === undefined) {
			obj = new VariableInfo();
		}
		obj.readTokens.push(variableReadToken);
		variables.set(variableName, obj);
	});
	variableAssignments.forEach(function(variableWriteToken) {
		const varNameToken = variableWriteToken.type === ParseTreeTokenType.STRING_LITERAL ?
			variableWriteToken :
			variableWriteToken.children[1].children[1];
		const variableName = evaluateStringLiteral(varNameToken.val);
		let obj = variables.get(variableName);
		if (obj === undefined)
			obj = new VariableInfo();
		obj.writeTokens.push(variableWriteToken);
		variables.set(variableName, obj);
	});
	variableReferences.forEach(function(referenceToken) {
		const variableName = getWebLogoVariableNameFromVariableReference(referenceToken);
		let obj = variables.get(variableName);
		if (obj !== undefined) {
			obj.varReferences.push(referenceToken);
		}
	});
	for (const varInfo of variables.values()) {
		updateIsAlwaysLocal(varInfo, isForProcedure);
	}
	return variables;
};