import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getLastDescendentTokenOf } from
'../../../../generic-parsing-utilities/getLastDescendentTokenOf.js';
import { insertLineIndexSpanAt } from
'../../../../generic-parsing-utilities/insertLineIndexSpanAt.js';
import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../qbasic/ParseTreeTokenType.js';

// Commodore function names defined using DEF
// must start with "fn" or "FN".
// This function adds the necessary characters to
// get that prefix.
function sanitizeFunctionName(name) {
	if (name.toLowerCase().startsWith('fn'))
		return name;
	if (name[0].toLowerCase() === 'n') {
		if (name[0] === 'n') // try to use a consistent case.
			return 'f' + name;
		else
			return 'F' + name;
	}
	if (name[0].toLowerCase() === name[0])
		return 'fn' + name;
	else
		return 'FN' + name;
}

function isCodeBlockNeeded(def) {
	return !def.children.some(t => t.type === ParseTreeTokenType.CODE_BLOCK);
}

function defToNameToken(token) {
	const children = token.children;
	if (children.length !== 0) {
		const first = children[0];
		if (first.type === ParseTreeTokenType.IDENTIFIER)
			return first;
	}
}

function defToFunctionName(token) {
	const nameToken = defToNameToken(token);
	if (nameToken !== undefined)
		return nameToken.val.toLowerCase();
}

function isOfInterest(token) {
	const children = token.children;
	if (children.length !== 2 && children.length !== 3)
		return false;
	if (children.length === 3) {
		const thirdChild = children[2];
		if (thirdChild.type !== ParseTreeTokenType.CODE_BLOCK)
			return false;
	}

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
		const newCodeBlockNeeded = isCodeBlockNeeded(def);
		const fname = sanitizeFunctionName(defToFunctionName(def));
		const nameToken = defToNameToken(def);
		nameToken.val = fname;
		const argList = def.children[1];
		const assignToken = argList.children[0];
		const curvedBracketExpression = assignToken.children[0];
		const argListLast = getLastDescendentTokenOf(curvedBracketExpression);
		const resultToken = new ParseTreeToken(fname, argListLast.lineIndex,
			argListLast.colIndex + 1, ParseTreeTokenType.IDENTIFIER);
		assignToken.replaceChild(curvedBracketExpression, resultToken);
		assignToken.type = ParseTreeTokenType.ASSIGNMENT;
		let codeBlock;
		if (newCodeBlockNeeded) {
			codeBlock = new ParseTreeToken(null, argListLast.lineIndex,
				argListLast.colIndex + 1, ParseTreeTokenType.CODE_BLOCK);
			def.appendChild(codeBlock);
		}
		else
			codeBlock = def.children[2];

		assignToken.remove();
		codeBlock.insertAsFirstChild(assignToken);
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
		if (newCodeBlockNeeded) {
			insertLineIndexSpanAt(argListLast, 1);
			insertLineIndexSpanAt(lastCodeBlockDescendent, 1);
		}
	});
	return defs.length !== 0;
};