import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

function getArgCountFromParent(token) {
	const children = token.children;
	let result = children.length;
	if (children[0].val === '(')
		result--;
	if (children[children.length - 1].val === ')')
		result--;
	return result;
}

/*
Finds the number of arguments based on the specified commandInfo.
The commandInfo could be from a version of Logo other than WebLogo
but should be in a similar format.  It could be from data 
in json/logo-migrations json files.

token must be a WebLogo ParseTreeToken as defined from 
modules/parsing/ParseTreeToken.js.
*/
export function getArgCount(commandInfo, token) {
	const parent = token.parentNode;
	if (commandInfo.argCount !== undefined &&
	parent.children.indexOf(token) <= 1 &&
	parent.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
		return getArgCountFromParent(parent);
	if (commandInfo.args instanceof Array)
		return commandInfo.args.length;
	else
		return 0;
};