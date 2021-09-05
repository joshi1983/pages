import { containsIndirectMakeOrLocalmake } from './optimize-variable-access/containsIndirectMakeOrLocalmake.js';
import { convertAssignmentCommandToJavaScriptAssignment }
from './optimize-variable-access/convertAssignmentCommandToJavaScriptAssignment.js';
import { flatten } from '../../../../generic-parsing-utilities/flatten.js';
import { getEndingMakeStatement } from './optimize-variable-access/getEndingMakeStatement.js';
import { getNewVariableNamesFor } from './optimize-variable-access/getNewVariableNamesFor.js';
import { getVariableReadRootToken } from './optimize-variable-access/getVariableReadRootToken.js';
import { getVariableCountsFromParseTree } from './optimize-variable-access/getVariableCountsFromParseTree.js';
import { isContextReadVariableCall } from './token-classifiers/isContextReadVariableCall.js';
import { MaybeDecided } from '../../../../../MaybeDecided.js';
import { parse } from '../../../../js-parsing/parse.js';
import { parseTreeTokensToCode } from '../../../../js-parsing/parseTreeTokensToCode.js';
import { ParseTreeTokenType } from '../../../../js-parsing/ParseTreeTokenType.js';
import { removeLocalVariablesDeclarations } from './optimize-variable-access/removeLocalVariablesDeclarations.js';
import { shouldInitializeLocalVariables } from './optimize-variable-access/shouldInitializeLocalVariables.js';
import { useLocalVariablesVariable } from './optimize-variable-access/useLocalVariablesVariable.js';

export function optimizeVariableAccessInJavaScript(jsCode) {
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
	const counts = getVariableCountsFromParseTree(parseResult.root);
	const allTokens = flatten(parseResult.root);
	let prefix = '';
	let after = '';
	const varsToAdd = [];
	for (const [varName, info] of counts) {
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
	const newNames = getNewVariableNamesFor(varsToAdd, parseResult.root);
	for (let i = 0; i < varsToAdd.length; i++) {
		const oldName = varsToAdd[i];
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
			rootToken.val = oldName;
		});
		info.writeTokens.forEach(function(writeToken) {
			// convert to a JavaScript assignment statement.
			convertAssignmentCommandToJavaScriptAssignment(writeToken, newNames[i]);
		});
		if (info.writeTokens.length > 0) {
			after += getEndingMakeStatement(varsToAdd[i], newNames[i], info.isAlwaysLocal, info.isAlwaysGlobal, localVariablesIsSet);
		}
	}
	if (localVariablesIsSet)
		useLocalVariablesVariable(parseResult.root);
	const outJsCode = parseTreeTokensToCode(flatten(parseResult.root)).trim();
	return (prefix1 + prefix + outJsCode + after).trim();
};