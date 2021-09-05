import { createInstructionList } from './createInstructionList.js';
import { ExpectedChildrenResult, hasAllExpectedChildren } from './hasAllExpectedChildren.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { PovRayCommand } from '../PovRayCommand.js';

const appendChildTypes = new Set([
	ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
	ParseTreeTokenType.DICTIONARY,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.PARAMETERIZED_GROUP
]);

function shouldAppendChild(token) {
	if (token.parentNode === null)
		return true;
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = PovRayCommand.getCommandInfo(token.val);
		if (info !== undefined && info.args !== undefined && info.args.length !== 0)
			return true;
		return false;
	}
	return appendChildTypes.has(token.type);
}

function isPreviousForCodeBlock(prev) {
	if (prev.type === ParseTreeTokenType.FUNCTION)
		return true;
	return false;
}

export function processCurlyLeftBracket(prev, next) {
	let type = ParseTreeTokenType.CURLY_BRACKET_EXPRESSION;
	if (isPreviousForCodeBlock(prev))
		type = ParseTreeTokenType.CODE_BLOCK;
	const e = new ParseTreeToken(null, next.lineIndex, next.colIndex, type);
	if (shouldAppendChild(prev))
		prev.appendChild(e);
	else {
		while (prev.parentNode.parentNode !== null &&
		hasAllExpectedChildren(prev.parentNode) === ExpectedChildrenResult.RIGIDLY_EQUAL)
			prev = prev.parentNode;
		prev.appendSibling(e);
	}
	e.appendChild(next);
	if (type === ParseTreeTokenType.CODE_BLOCK) {
		return createInstructionList(e, next);
	}
	return e;
};