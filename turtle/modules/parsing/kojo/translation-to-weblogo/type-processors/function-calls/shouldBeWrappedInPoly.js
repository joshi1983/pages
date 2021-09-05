import { evaluateToken } from
'../../../evaluation/evaluateToken.js';
import { filterBracketsAndCommas } from
'../helpers/filterBracketsAndCommas.js';
import { isNumber } from
'../../../../../isNumber.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

const ignorableNames = new Set([
	'println'
]);

function canInstructionBeIgnored(token) {
	if (token.type !== ParseTreeTokenType.FUNC_CALL)
		return false;
	const firstChild = token.children[0];
	if (firstChild === undefined ||
	firstChild.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	return ignorableNames.has(firstChild.val);
}

function matchesName(names) {
	names = new Set(names);
	return function(instruction) {
		if (instruction.type !== ParseTreeTokenType.FUNC_CALL)
			return false;

		const name = instruction.children[0];
		if (name === undefined || name.type !== ParseTreeTokenType.IDENTIFIER)
			return false;

		return names.has(name.val);
	};
}

function canTurn(instruction) {
	return matchesName(['left', 'right'])(instruction);
}

function getTurnAngleFromInstruction(instruction) {
	if (!canTurn(instruction))
		return;
	
	const argList = instruction.children[1];
	if (argList === undefined || argList.type !== ParseTreeTokenType.ARG_LIST)
		return;

	const args = filterBracketsAndCommas(argList.children);
	if (args.length > 2)
		return; // too many parameters to be valid.
	if (args.length === 0) {
		const name = instruction.children[0];
		// return default angles.
		if (name.val === 'right')
			return 90;
		else
			return -90;
	}
	const angle = evaluateToken(args[0]);
	if (isNumber(angle))
		return angle;
}

function getTurnAngle(instructions) {
	let result = 0;
	for (const instruction of instructions) {
		if (canTurn(instruction)) {
			result += getTurnAngleFromInstruction(instruction);
			if (!isNumber(result))
				return;
		}
	}
	return result;
}

function hasConstantMoveForward(instructions) {
	instructions = instructions.filter(matchesName(['forward', 'back']));
	if (instructions.length === 0)
		return false;
	return true;
}

function isRepeatDrawingRegularPolygon(token) {
	if (token.type !== ParseTreeTokenType.FUNC_CALL)
		return false;

	const nameToken = token.children[0];
	if (nameToken === undefined ||
	nameToken.type !== ParseTreeTokenType.IDENTIFIER ||
	nameToken.val !== 'repeat')
		return false;
	const argList = token.children[1];
	if (argList.children.length !== 3)
		return false;
	const numToken = argList.children[1];
	if (numToken.type !== ParseTreeTokenType.NUMBER_LITERAL)
		return false;

	const numRepeats = evaluateToken(numToken);
	if (!Number.isInteger(numRepeats) || numRepeats < 3)
		return false;

	const codeBlock = token.children[2];
	if (codeBlock === undefined ||
	codeBlock.type !== ParseTreeTokenType.CODE_BLOCK)
		return false;

	const instructions = filterBracketsAndCommas(codeBlock.children).
		filter(token => !canInstructionBeIgnored(token));
	if (instructions.length < 2)
		return false;
	if (instructions.some(matchesName(['beginShape', 'endShape'])))
		return false;

	const turnAngle = getTurnAngle(instructions);
	if (turnAngle === undefined ||
	Math.abs(turnAngle) < 360  / numRepeats)
		return false;

	return hasConstantMoveForward(instructions);
}

function isLikelyInBeginShape(token) {
	if (token.type === ParseTreeTokenType.TREE_ROOT)
		return false;

	const children = token.parentNode.children;
	for (let i = children.indexOf(token) - 1; i >= 0; i--) {
		const child = children[i];
		if (child.type !== ParseTreeTokenType.FUNC_CALL)
			break;
		const nameToken = child.children[0];
		if (nameToken.type === ParseTreeTokenType.IDENTIFIER) {
			if (nameToken.val === 'beginShape')
				return true;
			else if (nameToken.val === 'endShape')
				return false;
		}
	}
	return false;
}

export function shouldBeWrappedInPoly(token) {
	if (isLikelyInBeginShape(token)) {
		return false;
	}
	if (isRepeatDrawingRegularPolygon(token))
		return true;
	return false;
};