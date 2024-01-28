import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

/*
funcCallToken could be something like the FUNCTION_CALL token in:
localVariables.set("x", 4);
Converts to:
x = 4;
*/
export function convertSetCallToJavaScriptAssignment(funcCallToken, jsVarName) {
	if (typeof jsVarName !== 'string')
		throw new Error(`jsVarName must be a string but found ${jsVarName}`);
	if (funcCallToken.type !== ParseTreeTokenType.FUNCTION_CALL)
		throw new Error(`funcCallToken.type expected to be a FUNCTION_CALL but got ${ParseTreeTokenType.getNameFor(funcCallToken.type)}`);
	if (funcCallToken.children.length !== 2)
		throw new Error(`funcCallToken.children.length expected to be 2 but got ${funcCallToken.children.length}`);
	const argList = funcCallToken.children[1];
	const commaToken = argList.children[2];
	const varNameToken = argList.children[1];
	varNameToken.val = jsVarName;
	varNameToken.type = ParseTreeTokenType.IDENTIFIER;
	varNameToken.originalString = undefined;
	commaToken.remove();
	let children = argList.children;
	for (let i = 0; i < children.length; i++) {
		const t = children[i];
		if (t.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET ||
		t.type === ParseTreeTokenType.CURVED_LEFT_BRACKET) {
			t.remove();
		}
	}
	argList.val = '=';
	argList.lineIndex = commaToken.lineIndex;
	argList.colIndex = commaToken.colIndex;
	argList.type = ParseTreeTokenType.ASSIGNMENT_OPERATOR;
	const funcCallTokenParent = funcCallToken.parentNode;
	argList.remove();
	funcCallTokenParent.replaceChild(funcCallToken, argList);
};