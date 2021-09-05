import { addCodeBlock } from './addCodeBlock.js';
import { functionDefinitionTypes } from './functionDefinitionTypes.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const nextTypesGenerallyNeedingCodeBlock = new Set([
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.DIM,
	ParseTreeTokenType.DO,
	ParseTreeTokenType.EXIT,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.LABEL,
	ParseTreeTokenType.LET,
	ParseTreeTokenType.LOOP,
	ParseTreeTokenType.NEXT,
	ParseTreeTokenType.REDIM,
	ParseTreeTokenType.SELECT,
	ParseTreeTokenType.WEND,
	ParseTreeTokenType.WHILE,
]);

function isCodeBlockExpectedForNextToken(prev, next) {
	if (prev.type === ParseTreeTokenType.CODE_BLOCK)
		return false;
	const children = prev.children;
	const lastChild = children[children.length - 1];
	if (lastChild !== undefined && lastChild.type === ParseTreeTokenType.CODE_BLOCK)
		return false;
	const parent = prev.parentNode;
	if (prev.type === ParseTreeTokenType.ARG_LIST) {
		if (functionDefinitionTypes.has(parent.type)) {
			if (lastChild !== undefined && lastChild.val === ')')
				return true;
			if (lastChild === undefined &&
			nextTypesGenerallyNeedingCodeBlock.has(next.type))
				return true;
		}
	}
	else if (prev.type === ParseTreeTokenType.CASE) {
		if (lastChild === undefined)
			return false;
		return nextTypesGenerallyNeedingCodeBlock.has(next.type);
	}
	else if (prev.type === ParseTreeTokenType.DO) {
		if (next.type === ParseTreeTokenType.WHILE)
			return false;
		return nextTypesGenerallyNeedingCodeBlock.has(next.type);
	}
	else if (prev.type === ParseTreeTokenType.DO_UNTIL ||
	prev.type === ParseTreeTokenType.DO_WHILE) {
		if (lastChild !== undefined) {
			return nextTypesGenerallyNeedingCodeBlock.has(next.type);
		}
	}
	else if (prev.type === ParseTreeTokenType.FOR) {
		if (lastChild === undefined ||
		lastChild.type === ParseTreeTokenType.NEXT)
			return false;
		if (lastChild.type === ParseTreeTokenType.STEP) {
			if (lastChild.children.length === 0)
				return false;
		}
		if (nextTypesGenerallyNeedingCodeBlock.has(next.type))
			return true;
	}
	else if (functionDefinitionTypes.has(prev.type)) {
		if (lastChild === undefined ||
		lastChild.type === ParseTreeTokenType.IDENTIFIER)
			return false;
		if (next.type === ParseTreeTokenType.END)
			return true;
		return nextTypesGenerallyNeedingCodeBlock.has(next.type);
	}
	if (prev.type === ParseTreeTokenType.WHILE) {
		if (lastChild === undefined)
			return false;
		return nextTypesGenerallyNeedingCodeBlock.has(next.type);
	}

	return false;
}

function isGoodPrevious(prev, next) {
	const parent = prev.parentNode;
	if (parent === null ||
	parent.type === ParseTreeTokenType.CODE_BLOCK ||
	prev.type === ParseTreeTokenType.CODE_BLOCK)
		return true;

	const children = prev.children;
	const lastChild = children[children.length - 1];
	if (prev.type === ParseTreeTokenType.UNTIL) {
		if (parent.type === ParseTreeTokenType.DO_UNTIL) {
			if (children.length === 0)
				return true;
			return false;
		}
	}
	if (prev.type === ParseTreeTokenType.ARG_LIST &&
	prev.children.length === 0 &&
	(parent.type === ParseTreeTokenType.DEF ||
	parent.type === ParseTreeTokenType.FUNCTION))
		return false; // An arg list is optional in a DEF statement so 
		// the arg list may be empty in the parse tree.

	if (prev.type === ParseTreeTokenType.STEP) {
		if (lastChild === undefined)
			return true;
		return false;
	}
	if (prev.type === ParseTreeTokenType.NEXT) {
		return lastChild === undefined;
	}
	if (prev.type === ParseTreeTokenType.WHILE) {
		if (parent.type === ParseTreeTokenType.DO_WHILE ||
		parent.type === ParseTreeTokenType.LOOP_WHILE)
			return lastChild === undefined;
	}
	return true;
}

function getGoodPrevious(prev, next) {
	while (!isGoodPrevious(prev, next))
		prev = prev.parentNode;
	return prev;
}

export function addCodeBlockIfNeeded(prev, next) {
	prev = getGoodPrevious(prev, next);
	if (isCodeBlockExpectedForNextToken(prev, next)) {
		return addCodeBlock(prev, next);
	}
};