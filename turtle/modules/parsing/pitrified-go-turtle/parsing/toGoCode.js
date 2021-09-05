import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { StringBuffer } from '../../../StringBuffer.js';

function processAssignmentOperator(token, result) {
	const children = token.children;
	if (children.length === 2)
		processBinaryOperator(token, result);
	else {
		const first = children[0];
		result.append(' ' + token.val);
		if (first !== undefined)
			processToken(first, result);
	}
}

function processBinaryOperator(token, result) {
	const children = token.children;
	const first = children[0];
	const second = children[1];
	if (first !== undefined)
		processToken(first, result);
	result.append(` ${token.val} `);
	if (second !== undefined)
		processToken(second, result);
}

const processorsMap = new Map([
	[ParseTreeTokenType.ASSIGNMENT_OPERATOR, processAssignmentOperator],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator]
]);
const newLineTypes = new Set([
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.FUNC,
	ParseTreeTokenType.GOTO,
	ParseTreeTokenType.LABEL,
	ParseTreeTokenType.IF,
]);
const lineBreakBetweenChildrenTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.SELECT_BLOCK,
	ParseTreeTokenType.SWITCH_BLOCK,
	ParseTreeTokenType.TREE_ROOT
]);
const noSpaceBetweenChildrenTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.CURVED_BRACKET_EXRESSION,
	ParseTreeTokenType.FUNC_CALL,
	ParseTreeTokenType.EXPRESSION_DOT_PROPERTY
]);
const removeSpaceBeforeTypes = new Set([
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.SEMICOLON
]);

function processToken(token, result) {
	if (token.lineIndex !== 0 && newLineTypes.has(token.type)) {
		result.trimRight();
		result.append('\n');
	}
	else if (removeSpaceBeforeTypes.has(token.type))
		result.trimRight();
	const processor = processorsMap.get(token.type);
	if (processor !== undefined) {
		processor(token, result);
		return;
	}
	if (token.val !== null)
		result.append(token.val + ' ');
	let separator = '';
	const spaceBetweenChildren = !noSpaceBetweenChildrenTypes.has(token.type);
	if (lineBreakBetweenChildrenTypes.has(token.type))
		separator = '\n';
	for (const child of token.children) {
		processToken(child, result);
		result.trimRight();
		if (spaceBetweenChildren)
			result.append(separator);
	}
}

/*
Converts a parse tree into corresponding Go code.
This is helpful for some automated tests that involve mutating the parse tree.
*/
export function toGoCode(token) {
	const result = new StringBuffer();
	processToken(token, result);
	return result.toString().trim();
};