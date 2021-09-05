import { evaluateStringLiteral } from '../../../../../js-parsing/evaluateStringLiteral.js';
import { flatten } from '../../../../../generic-parsing-utilities/flatten.js';
import { getParseTokensSorted } from '../../../../../parse-tree-token/getParseTokensSorted.js';
import { isContextGlobalVariableRead } from '../token-classifiers/isContextGlobalVariableRead.js';
import { isLocalVariableRead } from '../token-classifiers/isLocalVariableRead.js';
import { isLocalmakeAssignment } from '../token-classifiers/isLocalmakeAssignment.js';
import { isMakeAssignment } from '../token-classifiers/isMakeAssignment.js';
import { isNoContextGlobalVariableRead } from '../token-classifiers/isNoContextGlobalVariableRead.js';
import { isScopeAgnosticVariableRead } from '../token-classifiers/isScopeAgnosticVariableRead.js';
import { isVariableAssignment } from '../token-classifiers/isVariableAssignment.js';
import { isVariableReadToken } from '../token-classifiers/isVariableReadToken.js';
import { MaybeDecided } from '../../../../../../MaybeDecided.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

class VariableInfo {
	constructor() {
		this.isAlwaysLocal = undefined;
		this.isAlwaysGlobal = undefined;
		this.readTokens = [];
		this.writeTokens = [];
	}
}

function updateIsAlwaysLocal(varInfo) {
	const tokens = varInfo.readTokens.concat(varInfo.writeTokens);
	getParseTokensSorted(tokens);
	let t = tokens[0];
	if (isLocalVariableRead(t) || isLocalmakeAssignment(t)) {
		varInfo.isAlwaysLocal = MaybeDecided.Yes;
		varInfo.isAlwaysGlobal = MaybeDecided.No;
	}
	else if (isContextGlobalVariableRead(t) || isNoContextGlobalVariableRead(t)) {
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
}

export function getVariableCountsFromParseTree(rootToken) {
	const allTokens = flatten(rootToken);
	const variableReadTokens = allTokens.filter(isVariableReadToken);
	const variableAssignments = allTokens.filter(isVariableAssignment);
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
		const variableName = evaluateStringLiteral(variableWriteToken.val);
		let obj = variables.get(variableName);
		if (obj === undefined)
			obj = new VariableInfo();
		obj.writeTokens.push(variableWriteToken);
		variables.set(variableName, obj);
	});
	for (const varInfo of variables.values()) {
		updateIsAlwaysLocal(varInfo);
	}
	return variables;
};