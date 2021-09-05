import { getClosestOfType } from
'../../../generic-parsing-utilities/getClosestOfType.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

function getApplicableForLoop(prev) {
	const forLoop = getClosestOfType(prev, ParseTreeTokenType.FOR);
	if (forLoop === null)
		return null;

	if (forLoop.children.some(t => t.type === ParseTreeTokenType.STEP ||
	t.type === ParseTreeTokenType.CODE_BLOCK))
		return null; // don't add a new STEP child if it will only make the forLoop less valid.

	return forLoop;
}

export function processStep(prev, next) {
	const forLoop = getApplicableForLoop(prev);
	if (forLoop !== null) {
		forLoop.appendChild(next);
		return next;
	}
	prev.appendChild(next);
	return next;
};