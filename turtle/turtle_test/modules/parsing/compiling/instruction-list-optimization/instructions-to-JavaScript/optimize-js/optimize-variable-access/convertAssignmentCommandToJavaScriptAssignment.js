import { convertSetCallToJavaScriptAssignment } from
'./convertSetCallToJavaScriptAssignment.js';
import { getClosestOfType } from
'../../../../../generic-parsing-utilities/getClosestOfType.js';
import { isGlobalVariablesSetCall } from
'../token-classifiers/isGlobalVariablesSetCall.js';
import { isLocalVariablesSetCall } from
'../token-classifiers/isLocalVariablesSetCall.js';
import { ParseTreeTokenType } from
'../../../../../js-parsing/ParseTreeTokenType.js';


/*
Converting from something like context.make("x", 5);
to something like x = 5;

It could also be from a localmake call.
*/
function convertMakeAssignmentToJavaScriptAssignment(stringLiteralToken, newVarName) {
	const funcCall = getClosestOfType(stringLiteralToken, ParseTreeTokenType.FUNCTION_CALL);
	const funcCallParent = funcCall.parentNode;
	const argList = stringLiteralToken.parentNode;
	const index = argList.children.indexOf(stringLiteralToken);
	const commaToken = argList.children[index + 1];
	const rightSideValToken = argList.children[index + 2];
	const varNameToken = stringLiteralToken;
	varNameToken.val = newVarName;
	varNameToken.type = ParseTreeTokenType.IDENTIFIER;
	varNameToken.remove();
	const assignToken = commaToken;
	assignToken.val = '=';
	assignToken.type = ParseTreeTokenType.ASSIGNMENT_OPERATOR;
	varNameToken.remove();
	assignToken.appendChild(varNameToken);
	rightSideValToken.remove();
	assignToken.appendChild(rightSideValToken);
	funcCallParent.replaceChild(funcCall, assignToken);
}

export function convertAssignmentCommandToJavaScriptAssignment(stringLiteralToken, newVarName) {
	const funcCall = getClosestOfType(stringLiteralToken, ParseTreeTokenType.FUNCTION_CALL);
	if (isLocalVariablesSetCall(funcCall) || isGlobalVariablesSetCall(funcCall))
		convertSetCallToJavaScriptAssignment(funcCall, newVarName);
	else
		convertMakeAssignmentToJavaScriptAssignment(stringLiteralToken, newVarName)
};