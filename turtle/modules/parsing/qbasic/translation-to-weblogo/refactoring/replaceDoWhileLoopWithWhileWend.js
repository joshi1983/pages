import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

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
	const loopToken = doWhile.children[3];
	doWhile.type = ParseTreeTokenType.WHILE;
	doWhile.val = 'WHILE';
	conditionToken.remove();
	doToken.appendSibling(conditionToken);
	doToken.remove();
	childWhileToken.remove();
	loopToken.val = 'WEND';
	loopToken.type = ParseTreeTokenType.WEND;
}

export function replaceDoWhileLoopWithWhileWend(root) {
	const doWhileLoops = getDescendentsOfType(root, ParseTreeTokenType.DO_WHILE).
		filter(isOfInterest);
	doWhileLoops.forEach(convertToWhileWend);
	return doWhileLoops.length !== 0;
};