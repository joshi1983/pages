import { createInstructionList } from './createInstructionList.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const endedTypes = new Set([
	ParseTreeTokenType.IF,
	ParseTreeTokenType.IFDEF,
	ParseTreeTokenType.IFNDEF,
	ParseTreeTokenType.MACRO,
	ParseTreeTokenType.SWITCH,
	ParseTreeTokenType.WHILE,
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (endedTypes.has(token.type)) {
		const lastChild = token.children[token.children.length - 1];
		if (lastChild !== undefined && lastChild.type === ParseTreeTokenType.END)
			return false;
		return true;
	}
	return false;
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

function getGoodInstructionListParent(prev) {
	let tok = prev;
	while (tok !== null && tok.type !== ParseTreeTokenType.INSTRUCTION_LIST) {
		if (endedTypes.has(tok.type) ||
		tok.type === ParseTreeTokenType.CASE) {
			if (tok.type === ParseTreeTokenType.SWITCH)
				return null;
			return tok;
		}
		tok = tok.parentNode;
	}
	return null;
}

export function processEnd(prev, next) {
	const instructionListParent = getGoodInstructionListParent(prev);
	if (instructionListParent !== null) {
		prev = createInstructionList(instructionListParent, prev);
	}
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	if (prev.parentNode !== null)
		return prev.parentNode;
	return prev;
};