import { isComplete } from './isCompleteWithNext.js';
import { MaybeDecided } from '../../../MaybeDecided.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodColonParentTypes = new Set([
	ParseTreeTokenType.ARRAY_SUBSCRIPT,
	ParseTreeTokenType.CASE,
	ParseTreeTokenType.DEFAULT,
	ParseTreeTokenType.STRUCT_VALUES_EXPRESSION
]);

function shouldBecomeLabel(token) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER ||
	token.children.length !== 0)
		return false;
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.CODE_BLOCK &&
	parent.type !== ParseTreeTokenType.TREE_ROOT)
		return false;
	return true;
}

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (isComplete(token) === MaybeDecided.No)
		return true;
	if (shouldBecomeLabel(token))
		return true;

	return goodColonParentTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

function shouldCreateCodeBlock(prev) {
	if (prev.type === ParseTreeTokenType.CASE ||
	prev.type === ParseTreeTokenType.DEFAULT)
		return true;
	return false;
}

export function processColon(prev, next) {
	prev = getGoodPrevious(prev);
	if (shouldBecomeLabel(prev)) {
		prev.type = ParseTreeTokenType.LABEL;
	}
	else if (shouldCreateCodeBlock(prev)) {
		const codeBlock = new ParseTreeToken(null, next.lineIndex, next.colIndex,
			ParseTreeTokenType.CODE_BLOCK);
		prev.appendChild(next);
		prev.appendChild(codeBlock);
		return codeBlock;
	}
	prev.appendChild(next);
	if (prev.type === ParseTreeTokenType.LABEL)
		return prev.parentNode;
	return next;
};