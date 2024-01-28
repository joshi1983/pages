import { assignTokenToJSVarName } from './optimize-variable-access/assignTokenToJSVarName.js';
import { evaluateStringLiteral } from '../../../../js-parsing/evaluateStringLiteral.js';
import { flatten } from '../../../../generic-parsing-utilities/flatten.js';
import { getClosestOfType } from '../../../../generic-parsing-utilities/getClosestOfType.js';
import { getWebLogoVariablesFromJS } from './optimize-variable-access/getWebLogoVariablesFromJS.js';
import { isAfterOrSame } from '../../../../generic-parsing-utilities/isAfterOrSame.js';
import { isLocalVariablesDeclared } from './optimize-variable-access/isLocalVariablesDeclared.js';
import { isNeedingToMoveDeclarations } from './optimize-variable-access/isNeedingToMoveDeclarations.js';
import { isJSVariableDeclareAssignment } from './token-classifiers/isJSVariableDeclareAssignment.js';
import { mayBeLastVariableAssignmentForWebLogoVariable } from './token-classifiers/mayBeLastVariableAssignmentForWebLogoVariable.js';
import { moveVariableDeclarationsToStart } from './optimize-variable-access/moveVariableDeclarationsToStart.js';
import { parse } from '../../../../js-parsing/parse.js';
import { parseTreeTokensToCode } from '../../../../js-parsing/parseTreeTokensToCode.js';
import { ParseTreeTokenType } from '../../../../js-parsing/ParseTreeTokenType.js';
import { removeLocalVariablesDeclarations } from './optimize-variable-access/removeLocalVariablesDeclarations.js';
import { removeUnneededAssignments } from './removeUnneededAssignments.js';

function isBadBeforeSemicolon(token) {
	if (token.type === ParseTreeTokenType.SEMICOLON)
		return true; // 2 consecutive semicolons is redundant.
	if (token.children.length !== 0) {
		const lastChild = token.children[token.children.length - 1];
		if (lastChild.type === ParseTreeTokenType.CODE_BLOCK && lastChild.children.length > 1 &&
		lastChild.children[lastChild.children.length - 1].type === ParseTreeTokenType.CURLY_RIGHT_BRACKET) {
			// For example, if (true) { };
			return true;
		}
	}
	return false;
}

function removeRedundentSemicolons(allTokens) {
	for (let i = 0; i < allTokens.length; i++) {
		const token = allTokens[i];
		if (token.type === ParseTreeTokenType.SEMICOLON) {
			const prev = token.getPreviousSibling();
			if (prev !== null && isBadBeforeSemicolon(prev)) {
				token.remove();
			}
		}
	}
}

function isPartOfAssignment(readToken, assignToken) {
	const assignRoot = assignToken.parentNode;
	while (readToken !== null && readToken !== assignRoot) {
		readToken = readToken.parentNode;
	}
	return readToken === assignRoot;
}

export function sanitizeMergedJS(code) {
	let parseResult = parse(code);
	let allTokens = flatten(parseResult.root);
	const isLocalVariablesDeclared_ = isLocalVariablesDeclared(allTokens);
	if (isLocalVariablesDeclared_) {
		code = removeLocalVariablesDeclarations(code).trim();
		parseResult = parse(code);
		allTokens = flatten(parseResult.root);
	}
	// if any variables are declared and initialized to local or global WebLogo code variables, move their declarations to the top.
	// move any of the make, localmake... lines associated with js variables which correspond with WebLogo variables, move those final assignments to the end.
	let variables = getWebLogoVariablesFromJS(allTokens);
	if (isNeedingToMoveDeclarations(variables)) {
		code = moveVariableDeclarationsToStart(allTokens, variables, isLocalVariablesDeclared_);
		parseResult = parse(code);
		allTokens = flatten(parseResult.root);
		variables = getWebLogoVariablesFromJS(allTokens);
	}
	for (const [webLogoName, info] of variables) {
		// remove any assignment tokens after the very first one.
		const firstAssignToken = info.getFirstAssignToken();
		if (firstAssignToken === undefined)
			continue;
		const newJSName = assignTokenToJSVarName(firstAssignToken);
		for (let i = 0; i < info.assignTokens.length; i++) {
			const assignToken = info.assignTokens[i];
			if (assignToken !== firstAssignToken &&
			isJSVariableDeclareAssignment(assignToken)) {
				const rootToken = assignToken.parentNode.parentNode;
				rootToken.remove();
			}
		}
		// If there is more than one corresponding JavaScript variable name,
		// rename any other references to newJSName.
		for (const readToken of info.readTokens) {
			if (isAfterOrSame(readToken, firstAssignToken)) {
				if (readToken.type === ParseTreeTokenType.IDENTIFIER)
					readToken.val = newJSName;
				else if (!isPartOfAssignment(readToken, firstAssignToken)) {
					const funcCall = getClosestOfType(readToken, ParseTreeTokenType.FUNCTION_CALL);
					const funcCallParent = funcCall.parentNode;
					funcCallParent.replaceChild(funcCall, readToken);
					funcCall.remove();
					readToken.type = ParseTreeTokenType.IDENTIFIER;
					readToken.val = newJSName;
					readToken.originalString = readToken.val;
				}
			}
		}
	}

	removeRedundentSemicolons(allTokens);
	code = parseTreeTokensToCode(flatten(parseResult.root)).trim();
	if (isLocalVariablesDeclared_) {
		code = 'const localVariables = context.getCurrentExecutingProcedure().localVariables;\n' + code;
	}
	code = removeUnneededAssignments(code);
	return code;
};