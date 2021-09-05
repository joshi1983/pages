import { Command } from
'../../../../Command.js';
import { getTokenValueWithEqualities } from
'./getTokenValueWithEqualities.js';
import { isInstructionList } from
'../../../isInstructionList.js';
import { isNumber } from
'../../../../../isNumber.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

export const endingNames = new Set([
	'break', 'output', 'stop'
]);

function isDoWhileDefinitely(token, tokenEqualities) {
	if (token.children.length !== 0)
		return false;

	return isDefinitelyEndingTheInstructionListList(token.children[0], tokenEqualities, true);
}


function isForeverDefinitely(token, tokenEqualities) {
	if (token.children.length !== 1)
		return false;

	return isDefinitelyEndingTheInstructionListList(token.children[0], tokenEqualities, true);
}

function isIfDefinitely(token, tokenEqualities, ignoreBreak) {
	if (token.children.length !== 2)
		return false;

	const condition = token.children[0];
	const val = getTokenValueWithEqualities(condition, tokenEqualities);
	if (val === true)
		return isDefinitelyEndingTheInstructionListList(token.children[1], tokenEqualities, ignoreBreak);

	return false;
}

function isIfElseDefinitely(token, tokenEqualities, ignoreBreak) {
	if (token.children.length < 2)
		return false;

	const condition = token.children[0];
	const val = getTokenValueWithEqualities(condition, tokenEqualities);
	if (val === true)
		return isDefinitelyEndingTheInstructionListList(token.children[1], tokenEqualities, ignoreBreak);
	if (val === false &&
	token.children.length < 3)
		return isDefinitelyEndingTheInstructionListList(token.children[2], tokenEqualities, ignoreBreak);
	
	return false;
}

export const checkers = new Map([
	['do.while', isDoWhileDefinitely],
	['forever', isForeverDefinitely],
	['if', isIfDefinitely],
	['ifelse', isIfElseDefinitely],
	['repeat', isRepeatDefinitely],
	['while', isWhileDefinitely]
]);

function isRepeatDefinitely(token, tokenEqualities) {
	const count = token.children[0];
	const val = getTokenValueWithEqualities(count, tokenEqualities);
	if (isNumber(val) && val >= 1)
		return isDefinitelyEndingTheInstructionListList(token.children[1], tokenEqualities, true);

	return false;
}

function isWhileDefinitely(token, tokenEqualities) {
	if (token.children.length !== 2)
		return false;

	const condition = token.children[0];
	const val = getTokenValueWithEqualities(condition, tokenEqualities);
	if (val === true)
		return isDefinitelyEndingTheInstructionListList(token.children[1], tokenEqualities, true);

	return false;
}

function isDefinitelyEndingTheInstructionListList(token, tokenEqualities, ignoreBreak) {
	for (const child of token.children) {
		if (isDefinitelyEndingTheInstructionList(child, tokenEqualities, ignoreBreak))
			return true;
	}
	return false;
}

export function isDefinitelyEndingTheInstructionList(token, tokenEqualities, ignoreBreak) {
	if (ignoreBreak === undefined)
		ignoreBreak = false;
	if (isInstructionList(token.type))
		return isDefinitelyEndingTheInstructionListList(token, tokenEqualities, ignoreBreak);

	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined) {
			if (endingNames.has(info.primaryName)) {
				if (info.primaryName === 'break')
					return !ignoreBreak;

				return true;
			}
			const checker = checkers.get(info.primaryName);
			if (checker !== undefined &&
			checker(token, tokenEqualities, ignoreBreak))
				return true;
		}
	}

	return false;
};