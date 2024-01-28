import { ParseTreeToken } from '../../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

/*
Converts code like context.make("x", 4)
to code like context.globalVariables.set("x", 4)

This optimizes performance by accomplishing the same effect without
checking if the variable is global and with at least 1 less function call.

Do not call this if the make call might be assigning a local variable because
context.globalVariables.set will never assign a new value to a local variable.
*/
export function convertMakeToGlobalVariablesSet(makeToken) {
	const argListToken = makeToken.parentNode;
	const contextToken = argListToken.parentNode.children[0];
	const makeIdentifierToken = contextToken.children[0].children[0];
	makeIdentifierToken.colIndex -= 3; 
	// This is a little hack to cause parseTreeTokensToCode to return 
	// the new tokens in the desired places.
	// Not reducing colIndex can lead parseTreeTokensToCode
	// to return something like .globalVariables(."x",set instead of .globalVariables.set("x",

	makeIdentifierToken.val = 'globalVariables';
	const newDotToken = new ParseTreeToken('.', makeIdentifierToken.lineIndex, makeIdentifierToken.colIndex + 1, ParseTreeTokenType.DOT);
	makeIdentifierToken.appendChild(newDotToken);
	const newSetToken = new ParseTreeToken('set', makeIdentifierToken.lineIndex, makeIdentifierToken.colIndex + 2, ParseTreeTokenType.IDENTIFIER);
	newDotToken.appendChild(newSetToken);
};