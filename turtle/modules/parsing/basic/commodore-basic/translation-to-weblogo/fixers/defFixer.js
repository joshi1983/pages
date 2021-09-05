import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getLastDescendentTokenOf } from
'../../../../generic-parsing-utilities/getLastDescendentTokenOf.js';
import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../qbasic/ParseTreeTokenType.js';

function defToFunctionName(token) {
	const children = token.children;
	if (children.length !== 0) {
		const first = children[0];
		if (first.type === ParseTreeTokenType.IDENTIFIER)
			return first.val.toLowerCase();
	}
}

function isOfInterest(token) {
	const children = token.children;
	if (children.length !== 2)
		return false;

	const argList = children[1];
	const argListChildren = argList.children;
	if (argListChildren.length !== 1)
		return false;
	const argFirst = argListChildren[0];
	if (argFirst.val !== '=' || argFirst.children.length === 0)
		return false;
	const fname = defToFunctionName(token);
	if (fname === undefined)
		return false;
	const leftSide = argFirst.children[0];
	if (leftSide.type !== ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
		return false;

	return true;
}

/*
Converts things like:
def fnx(x) = x * 3

to structures similar to:
def fnx(x) fnx = x * 3
*/
export function defFixer(root) {
	const defs = getDescendentsOfType(root,
		ParseTreeTokenType.DEF).filter(isOfInterest);
	defs.forEach(function(def) {
		const fname = defToFunctionName(def);
		const argList = def.children[1];
		const assignToken = argList.children[0];
		const curvedBracketExpression = assignToken.children[0];
		const argListLast = getLastDescendentTokenOf(curvedBracketExpression);
		const resultToken = new ParseTreeToken(fname, argListLast.lineIndex,
			argListLast.colIndex + 1, ParseTreeTokenType.IDENTIFIER);
		assignToken.replaceChild(curvedBracketExpression, resultToken);
		const codeBlock = new ParseTreeToken(null, argListLast.lineIndex,
			argListLast.colIndex + 1, ParseTreeTokenType.CODE_BLOCK);
		assignToken.remove();
		codeBlock.appendChild(assignToken);
		assignToken.type = ParseTreeTokenType.ASSIGNMENT;
		def.appendChild(codeBlock);
		const lastCodeBlockDescendent = getLastDescendentTokenOf(codeBlock);
		const endDef = new ParseTreeToken(null, lastCodeBlockDescendent.lineIndex,
			lastCodeBlockDescendent.colIndex + 1,
			ParseTreeTokenType.END_DEF);
		const endToken = new ParseTreeToken('end', endDef.lineIndex, endDef.colIndex,
			ParseTreeTokenType.END);
		const defToken = new ParseTreeToken('def', endDef.lineIndex, endDef.colIndex + 1,
			ParseTreeTokenType.DEF);
		endDef.appendChild(endToken);
		endDef.appendChild(defToken);
		def.appendChild(endDef);
		argList.appendChild(curvedBracketExpression);
		curvedBracketExpression.removeSingleToken();
	});
};