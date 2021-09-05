import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

const doLoopTypes = new Set([
	ParseTreeTokenType.DO,
	ParseTreeTokenType.DO_UNTIL,
	ParseTreeTokenType.DO_WHILE
]);

function replaceExitDoWithExitWhile(token) {
	if (doLoopTypes.has(token.type))
		return; // stop the recursion before it can break
		// an EXIT DO that should remain as is.

	if (token.type === ParseTreeTokenType.EXIT) {
		const child = token.children[0];
		if (child !== undefined && child.type === ParseTreeTokenType.DO) {
			child.type = ParseTreeTokenType.WHILE;
			child.val = 'WHILE';
		}
	}
	else {
		for (const child of token.children) {
			replaceExitDoWithExitWhile(child);
		}
	}
}

function isOfInterest(token) {
	const children = token.children;
	if (children.length !== 4)
		return false;
	if (children[0].type !== ParseTreeTokenType.DO ||
	children[1].type !== ParseTreeTokenType.WHILE ||
	children[2].type !== ParseTreeTokenType.CODE_BLOCK ||
	children[3].type !== ParseTreeTokenType.LOOP)
		return false;
	return true;
}

function convertToWhileWend(doWhile) {
	const doToken = doWhile.children[0];
	const childWhileToken = doWhile.children[1];
	const conditionToken = doWhile.children[1].children[0];
	const codeBlock = doWhile.children[2];
	const loopToken = doWhile.children[3];
	doWhile.type = ParseTreeTokenType.WHILE;
	doWhile.val = 'WHILE';
	conditionToken.remove();
	doToken.appendSibling(conditionToken);
	doToken.remove();
	childWhileToken.remove();
	loopToken.val = 'WEND';
	loopToken.type = ParseTreeTokenType.WEND;
	replaceExitDoWithExitWhile(codeBlock);
}

/*
do while condition
	instructions
loop
is essentially the same as:
while condition
	instructions
wend.

Since they do the same thing, converting one to the other simplifies and makes more reliable
the later translation work on these structures.  1 loop structure is simpler and more likely to get bug-free than
2 equal loop structures.
*/
export function replaceDoWhileLoopWithWhileWend(root) {
	const doWhileLoops = getDescendentsOfType(root, ParseTreeTokenType.DO_WHILE).
		filter(isOfInterest);
	doWhileLoops.forEach(convertToWhileWend);
	return doWhileLoops.length !== 0;
};