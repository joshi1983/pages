import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodColonParentTypes = new Set([
	ParseTreeTokenType.ARRAY_SUBSCRIPT,
	ParseTreeTokenType.CASE,
	ParseTreeTokenType.DEFAULT,
	ParseTreeTokenType.STRUCT_VALUES_EXPRESSION
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
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
	if (shouldCreateCodeBlock(prev)) {
		const codeBlock = new ParseTreeToken(null, next.lineIndex, next.colIndex,
			ParseTreeTokenType.CODE_BLOCK);
		prev.appendChild(next);
		prev.appendChild(codeBlock);
		return codeBlock;
	}
	prev.appendChild(next);
	return next;
};