import { flatten } from '../../../../generic-parsing-utilities/flatten.js';
import { getAllDescendentsAsArray } from '../../../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getDescendentsOfType } from '../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getSortedFirstTokenFromArray } from '../../../../generic-parsing-utilities/getSortedFirstTokenFromArray.js';
import { getSortedLastDescendentTokenOf } from '../../../../generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { isValueStackPush } from './token-classifiers/isValueStackPush.js';
import { isValueStackReference } from './token-classifiers/isValueStackReference.js';
import { parse } from '../../../../js-parsing/parse.js';
import { ParseTreeToken } from '../../../../generic-parsing-utilities/ParseTreeToken.js';
import { parseTreeTokensToCode } from '../../../../js-parsing/parseTreeTokensToCode.js';
import { ParseTreeTokenType } from '../../../../js-parsing/ParseTreeTokenType.js';
import { removeSemicolonsImmediatelyAfter } from './removeSemicolonsImmediatelyAfter.js';

const nonValueTypes = new Set([
ParseTreeTokenType.COMMA,
ParseTreeTokenType.CURVED_LEFT_BRACKET,
ParseTreeTokenType.CURVED_RIGHT_BRACKET,
]);

/*
For example, context.valueStack.push(1, 3, 4, "x", 100) is safe to move all value tokens.

context.valueStack.push(context.valueStack.length) is not safe 
to move all value tokens to a previous push because it'll change behaviour.
*/
function isSafeToMoveValues(pushToken) {
	const children = pushToken.children[1].children;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		const descendents = getAllDescendentsAsArray(child);
		descendents.push(child);
		if (descendents.some(isValueStackReference))
			return false;
	}
	return true;
}

function getPreviousPush(token) {
	let children = token.parentNode.children;
	for (let index = children.indexOf(token) - 1; index >= 0; index--) {
		const beforeSibling = children[index];
		if (beforeSibling.type !== ParseTreeTokenType.SEMICOLON) {
			if (!isValueStackPush(beforeSibling))
				return;
			return beforeSibling;
		}
	}
}

function getNextPush(token) {
	let children = token.parentNode.children;
	for (let index = children.indexOf(token) + 1; index < children.length; index++) {
		const nextSibling = children[index];
		if (nextSibling.type !== ParseTreeTokenType.SEMICOLON) {
			if (!isValueStackPush(nextSibling))
				return;
			if (!isSafeToMoveValues(nextSibling))
				return;
			return nextSibling;
		}
	}
}

function adjustPositionsStartingAfter(parentToken, beforeToken) {
	const allDescendents = getAllDescendentsAsArray(parentToken);
	allDescendents.push(parentToken);
	let firstToken = getSortedFirstTokenFromArray(allDescendents);
	const colIndexOffset = beforeToken.colIndex - firstToken.colIndex;
	for (let i = allDescendents.length - 1; i >= 0; i--) {
		const t = allDescendents[i];
		t.lineIndex = beforeToken.lineIndex;
		t.colIndex += colIndexOffset;
	}
}

function moveValueTokens(toPush, fromPush) {
	const toChildren = toPush.children[1].children;
	const toPushLastBracket = toChildren[toChildren.length - 1];
	toChildren.pop();
	const fromChildren = fromPush.children[1].children;
	const fromValueTokens = fromChildren.filter(child => !nonValueTypes.has(child.type));
	let lastToken;
	for (let i = 0; i < fromValueTokens.length; i++) {
		lastToken = getSortedLastDescendentTokenOf(toChildren[toChildren.length - 1]);
		const newComma = new ParseTreeToken(',', lastToken.lineIndex, lastToken.colIndex + 1, ParseTreeTokenType.COMMA);
		const newChild = fromValueTokens[i];
		adjustPositionsStartingAfter(newChild, newComma);
		toChildren.push(newComma);
		newChild.remove();
		toChildren.push(newChild);
	}
	lastToken = getSortedLastDescendentTokenOf(toChildren[toChildren.length - 1]);
	toPushLastBracket.colIndex = lastToken.colIndex + 1;
	toChildren.push(toPushLastBracket);
	fromPush.remove();
}

function isArgBracketsOnSameLine(pushToken) {
	const argList = pushToken.children[1];
	const argStartBracket = argList.children[0];
	const argEndBracket = argList.children[argList.children.length - 1];
	return argStartBracket.lineIndex === argEndBracket.lineIndex;
}

function isOfInterest(token) {
	if (!isValueStackPush(token))
		return false;

	// are argument brackets on the same line?  This simplifies calculating the colIndex and lineIndex of moved tokens.
	if (!isArgBracketsOnSameLine(token))
		return false;

	const previousPush = getPreviousPush(token);
	if (previousPush !== undefined) {
		if (isSafeToMoveValues(previousPush))
			return false;
	}
	const nextPush = getNextPush(token);
	if (nextPush === undefined)
		return false;
	return true;
}

export function mergeConsecutiveValueStackPushes(jsCode) {
	const parseResult = parse(jsCode);
	const pushes = getDescendentsOfType(parseResult.root, ParseTreeTokenType.FUNCTION_CALL).
	filter(isOfInterest);
	if (pushes.length === 0)
		return jsCode;
	for (let i = 0; i < pushes.length; i++) {
		const push = pushes[i];
		if (push.parentNode !== null) {
			removeSemicolonsImmediatelyAfter(push);
			const argListChildren = push.children[1].children;
			const lastBracket = argListChildren[argListChildren.length - 1];
			let nextPush;
			for (let nextPush = getNextPush(push); nextPush !== undefined; ) {
				const newNextPush = getNextPush(nextPush);
				moveValueTokens(push, nextPush);
				nextPush = newNextPush;
			}
			const newSemicolon = new ParseTreeToken(';', lastBracket.lineIndex, lastBracket.colIndex + 1, ParseTreeTokenType.SEMICOLON);
			removeSemicolonsImmediatelyAfter(push);
			push.parentNode.appendChild(newSemicolon);
		}
	}
	const allTokens = flatten(parseResult.root);
	return parseTreeTokensToCode(allTokens);
};