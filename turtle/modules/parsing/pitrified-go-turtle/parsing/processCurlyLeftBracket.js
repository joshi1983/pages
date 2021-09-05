import { isComplete, isCompleteWithNext } from
'./isCompleteWithNext.js';
import { isPossibleData } from
'./isPossibleData.js';
import { MaybeDecided } from
'../../../MaybeDecided.js';
import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { SetUtils } from
'../../../SetUtils.js';

const codeBlockParentTypes = new Set([
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.ELSE_IF,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.FUNC,
	ParseTreeTokenType.IF
]);

const goodTypes = new Set([
	ParseTreeTokenType.ARRAY_LITERAL,
	ParseTreeTokenType.INTERFACE,
	ParseTreeTokenType.SELECT,
	ParseTreeTokenType.STRUCT,
	ParseTreeTokenType.STRUCT_VALUES_EXPRESSION,
	ParseTreeTokenType.SWITCH
]);

SetUtils.addAll(goodTypes, codeBlockParentTypes);

function fixStructValuesExpression(sve) {
	for (const child of sve.children) {
		if (child.type === ParseTreeTokenType.COMMA_EXPRESSION)
			child.removeSingleToken();
	}
}

function isLikelyForCodeBlockStart(prev, next) {
	const parent = prev.parentNode;
	if (parent === null)
		return false;
	for (const type of codeBlockParentTypes) {
		let closest = prev;
		while (closest !== null && closest.type !== type) {
			if (isComplete(prev) === MaybeDecided.No) {
				closest = null;
				break;
			}
			closest = closest.parentNode;
		}

		if (closest !== null &&
		!closest.children.some(c => c.type === ParseTreeTokenType.CODE_BLOCK))
			return true;
	}
	return false;
}

function isGoodPrevious(prev, next) {
	const parent = prev.parentNode;
	if (parent === null)
		return true;

	if (isComplete(prev) === MaybeDecided.No)
		return true;

	if (isCompleteWithNext(prev, next))
		return false;

	const children = prev.children;
	const lastChild = children[children.length - 1];
	if (prev.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)
		return false;
	if (isPossibleData(prev) &&
	prev.type !== ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
		if (parent.type === ParseTreeTokenType.SWITCH &&
		parent.children.length === 1)
			return false;
		if (isLikelyForCodeBlockStart(prev, next))
			return false;

		if (prev.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY &&
		lastChild.type !== ParseTreeTokenType.IDENTIFIER)
			return false;

		return true;
	}
	return goodTypes.has(prev.type);
}

function getGoodPrevious(prev, next) {
	while (!isGoodPrevious(prev, next))
		prev = prev.parentNode;
	return prev;
}

function getTypeFor(prev) {
	if (prev.type === ParseTreeTokenType.SELECT)
		return ParseTreeTokenType.SELECT_BODY;
	if (prev.type === ParseTreeTokenType.SWITCH)
		return ParseTreeTokenType.SWITCH_BODY;
	if (prev.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)
		return ParseTreeTokenType.COMPOSITE_LITERAL_VALUE;
	if (prev.type === ParseTreeTokenType.STRUCT_INITIALIZATION)
		return ParseTreeTokenType.STRUCT_VALUES_EXPRESSION;
	if (prev.type === ParseTreeTokenType.ARRAY_LITERAL)
		return ParseTreeTokenType.ARRAY_VALUES_BLOCK;
	if (prev.type === ParseTreeTokenType.ARRAY_VALUES_BLOCK)
		return ParseTreeTokenType.ARRAY_VALUES_BLOCK;

	return ParseTreeTokenType.CODE_BLOCK;
}

function shouldCreateDataTypeExpression(prev) {
	if (prev.parentNode === null)
		return false;
	if (prev.type === ParseTreeTokenType.ARRAY_LITERAL ||
	prev.type === ParseTreeTokenType.ARRAY_VALUES_BLOCK)
		return false;
	if (goodTypes.has(prev.type))
		return false;
	if (prev.type === ParseTreeTokenType.RANGE)
		return false;
	if (isPossibleData(prev))
		return false;
	return true;
}

function shouldCreateStructInitialization(prev) {
	const parent = prev.parentNode;
	if (parent !== null && parent.type === ParseTreeTokenType.SWITCH)
		return false;
	if (prev.type === ParseTreeTokenType.ARRAY_LITERAL)
		return false;

	const children = prev.children;
	const lastChild = children[children.length - 1];
	if (prev.type === ParseTreeTokenType.STRUCT &&
	lastChild !== undefined &&
	lastChild.type === ParseTreeTokenType.CURLY_RIGHT_BRACKET) {
		return true;
	}
	return isPossibleData(prev);
}

function getCorrectingDTEAndCodeBlock(prev) {
	// look for a trailing code block.
	let codeBlock = prev;
	while (codeBlock.type !== ParseTreeTokenType.CODE_BLOCK ||
	(codeBlock.parentNode !== null &&
	(codeBlock.parentNode.type === ParseTreeTokenType.FUNC ||
	codeBlock.parentNode.type === ParseTreeTokenType.TREE_ROOT))) {
		const children = codeBlock.children;
		const lastChild = children[children.length - 1];
		if (lastChild === undefined)
			return;
		codeBlock = lastChild;
	}
	let dte = codeBlock.getPreviousSibling();
	while (dte !== null && dte.type !== ParseTreeTokenType.DATA_TYPE_EXPRESSION) {
		const children = dte.children;
		const lastChild = children[children.length - 1];
		if (lastChild === undefined)
			return;
		dte = lastChild;
	}
	return [dte, codeBlock];
}

function shouldCorrectPreviousCodeBlock(prev) {
	return getCorrectingDTEAndCodeBlock(prev) !== undefined;
}

function correctPreviousCodeBlock(prev) {
	const [dte, codeBlock] = getCorrectingDTEAndCodeBlock(prev);
	const tok = new ParseTreeToken(null, dte.lineIndex, dte.colIndex, ParseTreeTokenType.STRUCT_INITIALIZATION);
	codeBlock.type = ParseTreeTokenType.STRUCT_VALUES_EXPRESSION;
	const dteParent = dte.parentNode;
	dteParent.replaceChild(dte, tok);
	dte.remove();
	codeBlock.remove();
	tok.appendChild(dte);
	tok.appendChild(codeBlock);
	fixStructValuesExpression(codeBlock);
	return dteParent;
}

export function processCurlyLeftBracket(prev, next) {
	if (shouldCorrectPreviousCodeBlock(prev))
		prev = correctPreviousCodeBlock(prev);

	prev = getGoodPrevious(prev, next);
	if (shouldCreateDataTypeExpression(prev) || shouldCreateStructInitialization(prev)) {
		const type = shouldCreateDataTypeExpression(prev) ? ParseTreeTokenType.DATA_TYPE_EXPRESSION : ParseTreeTokenType.STRUCT_INITIALIZATION;
		const dtExpression = new ParseTreeToken(null, prev.lineIndex, prev.colIndex, type);
		const prevParent = prev.parentNode;
		prevParent.replaceChild(prev, dtExpression);
		dtExpression.appendChild(prev);
		prev = dtExpression;
	}
	else if (prev.type === ParseTreeTokenType.STRUCT ||
	prev.type === ParseTreeTokenType.INTERFACE) {
		prev.appendChild(next);
		return prev;
	}
	const type = getTypeFor(prev);
	const curlyBracketExpression = new ParseTreeToken(null, next.lineIndex, next.colIndex, type);
	curlyBracketExpression.appendChild(next);
	prev.appendChild(curlyBracketExpression);
	return curlyBracketExpression;
};