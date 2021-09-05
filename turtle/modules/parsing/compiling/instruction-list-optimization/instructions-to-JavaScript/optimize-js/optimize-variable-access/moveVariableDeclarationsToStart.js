import { assignTokenToJSVarName } from './assignTokenToJSVarName.js';
import { convertAssignmentCommandToJavaScriptAssignment } from './convertAssignmentCommandToJavaScriptAssignment.js';
import { convertSetCallToJavaScriptAssignment } from './convertSetCallToJavaScriptAssignment.js';
import { declaringTypes } from '../../../../../js-parsing/parsing/declaringTypes.js';
import { flatten } from '../../../../../generic-parsing-utilities/flatten.js';
import { getClosestOfType } from '../../../../../generic-parsing-utilities/getClosestOfType.js';
import { getEndingMakeStatement } from './getEndingMakeStatement.js';
import { getWebLogoVariablesFromJS } from './getWebLogoVariablesFromJS.js';
import { isLocalVariablesDeclaration } from '../token-classifiers/isLocalVariablesDeclaration.js';
import { isUnsafeToReplaceReferencesWithJSVariable } from './isUnsafeToReplaceReferencesWithJSVariable.js';
import { isVariableAssignmentRightSideToken } from '../token-classifiers/isVariableAssignmentRightSideToken.js';
import { mayBeFinalVariableAssignment } from '../token-classifiers/mayBeFinalVariableAssignment.js';
import { mayBeLastVariableAssignmentForWebLogoVariable } from '../token-classifiers/mayBeLastVariableAssignmentForWebLogoVariable.js';
import { needsEndingMake } from './needsEndingMake.js';
import { parse } from '../../../../../js-parsing/parse.js';
import { parseTreeTokensToCode } from '../../../../../js-parsing/parseTreeTokensToCode.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';
import { StringBuffer } from '../../../../../../StringBuffer.js';

function assignTokenToReadJSCode(assignToken) {
	const funcCall = assignToken.parentNode.children[1];
	let result = '';
	let t = funcCall.children[0];
	let expressionDotFound = false;
	while (t !== undefined) {
		if (t.val !== null)
			result += t.val;
		else if (t.type === ParseTreeTokenType.EXPRESSION_DOT)
			expressionDotFound = true;
		t = t.children[0];
	}
	if (expressionDotFound)
		result += '().localVariables.get';
	const argListChildren = funcCall.children[1].children;
	for (let i = 0; i < argListChildren.length; i++) {
		t = argListChildren[i];
		result += t.val;
	}
	return result;
}

function isReadTokenOfInterest(readToken) {
	if (readToken.type === ParseTreeTokenType.IDENTIFIER)
		return false;
	let readRoot = readToken.parentNode;
	if (readRoot.type === ParseTreeTokenType.ARG_LIST)
		readRoot = readRoot.parentNode;
	if (isVariableAssignmentRightSideToken(readRoot) &&
	readRoot.parentNode.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	readRoot.parentNode.val === '=' &&
	declaringTypes.has(readRoot.parentNode.parentNode.type))
		return false;
	return true;
}

function shouldAssignTokenBeRemoved(assignToken) {
	if (assignToken.type === ParseTreeTokenType.STRING_LITERAL)
		return false;
	const declareToken = assignToken.parentNode.parentNode;
	return declaringTypes.has(declareToken.type);
}

function copyVariableScopes(toVariables, fromVariables) {
	for (const varInfo of fromVariables.values()) {
		const toVarInfo = toVariables.get(varInfo.name);
		if (toVarInfo !== undefined) {
			toVarInfo.copyScopesFrom(varInfo);
		}
	}
}

export function moveVariableDeclarationsToStart(allTokens, variables, isLocalVariablesDeclared) {
	if (typeof isLocalVariablesDeclared !== 'boolean')
		throw new Error(`isLocalVariablesDeclared must be boolean but got ${isLocalVariablesDeclared}`);
	let root = getClosestOfType(allTokens[0], ParseTreeTokenType.TREE_ROOT);
	const localVariablesDeclarations = allTokens.filter(isLocalVariablesDeclaration);
	// get all the declarations from variables.
	// convert the declarations to a single string representing JavaScript code.
	const declarations = new StringBuffer();
	const endings = new StringBuffer();
	if (localVariablesDeclarations.length !== 0) {
		declarations.append(`const localVariables = context.getCurrentExecutingProcedure().localVariables;\n`);
		// remove any localVariables declarations from the parsed tree.
		localVariablesDeclarations.forEach(function(declaration) {
			const declarationRootToken = getClosestOfType(declaration, ParseTreeTokenType.CONST);
			declarationRootToken.remove();
		});
	}
	let values = Array.from(variables.values());
	for (let i = 0; i < values.length; i++) {
		let variable = values[i];
		if (variable.assignTokens.length === 0)
			continue;
		if (isUnsafeToReplaceReferencesWithJSVariable(variable))
			continue;
		const firstAssign = variable.getFirstAssignToken();
		const jsName = assignTokenToJSVarName(firstAssign);
		declarations.append(`let ${jsName} = ${assignTokenToReadJSCode(firstAssign)};\n`);
		variable.makeTokens.forEach(function(writeToken) {
			if (mayBeFinalVariableAssignment(writeToken, jsName) ||
			mayBeLastVariableAssignmentForWebLogoVariable(writeToken, variable))
				return;
			convertAssignmentCommandToJavaScriptAssignment(writeToken, jsName);
		});
		variable.setTokens.forEach(function(setToken) {
			// check that a previous conversion step didn't change setToken into something else.
			if (setToken.children.length === 2) {
				convertSetCallToJavaScriptAssignment(setToken, jsName);
			}
		});
		variable.readTokens.forEach(function(readToken) {
			if (isReadTokenOfInterest(readToken)) {
				const rootToken = getClosestOfType(readToken, ParseTreeTokenType.FUNCTION_CALL);
				const p = rootToken.parentNode;
				p.replaceChild(rootToken, readToken);
				readToken.type = ParseTreeTokenType.IDENTIFIER;
				readToken.val = jsName;
				readToken.originalString = undefined;
			}
		});
		const code = parseTreeTokensToCode(flatten(root)).trim();
		const parseResult = parse(code);
		root = parseResult.root;
		allTokens = flatten(root);
		const variables2 = getWebLogoVariablesFromJS(allTokens);
		copyVariableScopes(variables2, variables);
		values = Array.from(variables2.values());
		variable = variables2.get(variable.name);
		variables = variables2;
		if (variable !== undefined && needsEndingMake(variable)) {
			endings.append(getEndingMakeStatement(jsName, variable.name, variable.isAlwaysLocalAtEnd,
				variable.isAlwaysGlobal, isLocalVariablesDeclared || localVariablesDeclarations.length !== 0));
		}
	}
	// remove the assign tokens.
	for (const info of variables.values()) {
		if (info.assignTokens.length === 0)
			continue;
		if (isUnsafeToReplaceReferencesWithJSVariable(info))
			continue;
		// remove any assignment tokens after the very first one.
		for (let i = 0; i < info.assignTokens.length; i++) {
			const assignToken = info.assignTokens[i];
			if (shouldAssignTokenBeRemoved(assignToken)) {
				const rootToken = assignToken.parentNode.parentNode;
				rootToken.remove();
			}
		}
	}
	return declarations.toString() + parseTreeTokensToCode(flatten(root)).trim() + endings.toString();
};