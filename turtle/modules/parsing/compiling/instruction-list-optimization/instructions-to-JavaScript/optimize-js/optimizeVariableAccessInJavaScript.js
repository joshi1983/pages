import { containsIndirectMakeOrLocalmake } from './optimize-variable-access/containsIndirectMakeOrLocalmake.js';
import { convertAllMakeCallsToGlobalVariablesSet } from './optimize-variable-access/convertAllMakeCallsToGlobalVariablesSet.js';
import { convertAssignmentCommandToJavaScriptAssignment }
from './optimize-variable-access/convertAssignmentCommandToJavaScriptAssignment.js';
import { flatten } from '../../../../generic-parsing-utilities/flatten.js';
import { getEndingMakeStatement } from './optimize-variable-access/getEndingMakeStatement.js';
import { getJSVariableNamesFromWebLogoVariablesInfo } from './optimize-variable-access/getJSVariableNamesFromWebLogoVariablesInfo.js';
import { getNewVariableNamesFor } from './optimize-variable-access/getNewVariableNamesFor.js';
import { getTokensOfSafeIdentifiersFromWebLogoVariablesInfo } from './optimize-variable-access/getTokensOfSafeIdentifiersFromWebLogoVariablesInfo.js';
import { getVariableReadRootToken } from './optimize-variable-access/getVariableReadRootToken.js';
import { getVariableCountsFromParseTree } from './optimize-variable-access/getVariableCountsFromParseTree.js';
import { getWebLogoVariablesFromJS } from './optimize-variable-access/getWebLogoVariablesFromJS.js';
import { isContextReadVariableCall } from './token-classifiers/isContextReadVariableCall.js';
import { isUnsafeToReplaceReferencesWithJSVariableFromCounts } from './optimize-variable-access/isUnsafeToReplaceReferencesWithJSVariableFromCounts.js';
import { isUnsafeToReplaceReferencesWithJSVariable } from './optimize-variable-access/isUnsafeToReplaceReferencesWithJSVariable.js';
import { MaybeDecided } from '../../../../../MaybeDecided.js';
import { parse } from '../../../../js-parsing/parse.js';
import { parseTreeTokensToCode } from '../../../../js-parsing/parseTreeTokensToCode.js';
import { ParseTreeTokenType } from '../../../../js-parsing/ParseTreeTokenType.js';
import { removeLocalVariablesDeclarations } from './optimize-variable-access/removeLocalVariablesDeclarations.js';
import { removeUselessVariableDeclarations } from './optimize-variable-access/removeUselessVariableDeclarations.js';
import { shouldInitializeLocalVariables } from './optimize-variable-access/shouldInitializeLocalVariables.js';
import { useLocalVariablesVariable } from './optimize-variable-access/useLocalVariablesVariable.js';

export function optimizeVariableAccessInJavaScript(jsCode, isForProcedure) {
	if (isForProcedure === false)
		jsCode = convertAllMakeCallsToGlobalVariablesSet(jsCode);
	if (containsIndirectMakeOrLocalmake(jsCode))
		return jsCode;
	let prefix1 = '';
	let localVariablesIsSet = false;
	if (shouldInitializeLocalVariables(jsCode)) {
		prefix1 = 'const localVariables = context.getCurrentExecutingProcedure().localVariables;\n';
		localVariablesIsSet = true;
		jsCode = removeLocalVariablesDeclarations(jsCode);
	}
	const parseResult = parse(jsCode);
	const counts = getVariableCountsFromParseTree(parseResult.root, isForProcedure);
	let allTokens = flatten(parseResult.root);
	let prefix = '';
	let after = '';
	const varsToAdd = [];
	for (const [varName, info] of counts) {
		if (isUnsafeToReplaceReferencesWithJSVariableFromCounts(info))
			continue;
		if (info.readTokens.length > 1 || info.writeTokens.length > 1) {
			varsToAdd.push(varName);
		}
		else {
			if (info.isAlwaysLocal === MaybeDecided.Yes && localVariablesIsSet) {
				info.readTokens.forEach(function(readToken) {
					const rootToken = getVariableReadRootToken(readToken);
					if (isContextReadVariableCall(rootToken)) {
						const contextToken = rootToken.children[0];
						contextToken.val = 'localVariables';
						const readVariablesToken = contextToken.children[0].children[0];
						readVariablesToken.val = 'get';
					}
				});
			}
		}
	}
	allTokens = flatten(parseResult.root);
	const webLogoVariables = getWebLogoVariablesFromJS(allTokens);
	const tokensToIgnore = getTokensOfSafeIdentifiersFromWebLogoVariablesInfo(webLogoVariables);
	const newNames = getNewVariableNamesFor(varsToAdd, parseResult.root, tokensToIgnore);
	for (let i = 0; i < varsToAdd.length; i++) {
		const oldName = varsToAdd[i];
		const webLogoVarInfo = webLogoVariables.get(oldName);
		if (webLogoVarInfo !== undefined && isUnsafeToReplaceReferencesWithJSVariable(webLogoVarInfo))
			continue;
		const info = counts.get(oldName);
		prefix += `let ${newNames[i]} = `;
		if (info.isAlwaysLocal === MaybeDecided.Yes) {
			if (localVariablesIsSet)
				prefix += `localVariables.get("${varsToAdd[i]}")`;
			else
				prefix += `context.getCurrentExecutingProcedure().localVariables.get("${varsToAdd[i]}")`;
		}
		else if (info.isAlwaysGlobal === MaybeDecided.Yes)
			prefix += `context.globalVariables.get("${varsToAdd[i]}")`;
		else
			prefix += `context.readVariable("${varsToAdd[i]}")`;
		prefix += ';\n';
		info.readTokens.forEach(function(readToken) {
			const rootToken = getVariableReadRootToken(readToken);
			rootToken.children = [];
			rootToken.type = ParseTreeTokenType.IDENTIFIER;
			rootToken.val = newNames[i];
		});
		info.writeTokens.forEach(function(writeToken) {
			// convert to a JavaScript assignment statement.
			convertAssignmentCommandToJavaScriptAssignment(writeToken, newNames[i]);
		});
		if (info.writeTokens.length > 0) {
			after += getEndingMakeStatement(newNames[i], varsToAdd[i], info.isAlwaysLocalAtEnd, info.isAlwaysGlobal, localVariablesIsSet);
		}
	}
	allTokens = flatten(parseResult.root);
	removeUselessVariableDeclarations(allTokens, getJSVariableNamesFromWebLogoVariablesInfo(webLogoVariables));
	if (localVariablesIsSet)
		useLocalVariablesVariable(parseResult.root);
	const outJsCode = parseTreeTokensToCode(flatten(parseResult.root)).trim();
	return (prefix1 + prefix + outJsCode + after).trim();
};