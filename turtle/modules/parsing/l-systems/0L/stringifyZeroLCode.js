import { getNameFrom } from
'./parsing/parse-tree-analysis/getNameFrom.js';
import { ParseTreeTokenType } from
'./ParseTreeTokenType.js';
import { StringBuffer } from
'../../../StringBuffer.js';

function processArrow(token, result) {
	const children = token.children;
	const first = children[0];
	const second = children[1];
	if (first !== undefined)
		processToken(first, result);
	if (token.val !== null)
		result.append(token.val);
	if (second !== undefined)
		processToken(second, result);
}

function processCommandSequence(token, result) {
	for (const child of token.children) {
		result.append(child.val);
	}
}

function processIdentifier(token, result) {
	result.append(getNameFrom(token));
}

function processNumberLiteral(token, result) {
	result.append(token.val);
}

const processors = new Map([
	[ParseTreeTokenType.ARROW, processArrow],
	[ParseTreeTokenType.ASSIGNMENT, processArrow],
	[ParseTreeTokenType.COMMAND_SEQUENCE, processCommandSequence],
	[ParseTreeTokenType.COMPOSITE_IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.NUMBER_LITERAL, processNumberLiteral],
]);

function processToken(token, result) {
	const processor = processors.get(token.type);
	if (processor === undefined)
		throw new Error(`No processor defined for ${ParseTreeTokenType.getNameFor(token.type)}`);
	processor(token, result);
}

// This essentially turns an 0L parse tree into formatted 0L code.
// This is similar to WebLogo's formatCode function except the input is a parse tree.
export function stringifyZeroLCode(treeRoot) {
	const result = new StringBuffer();
	for (const child of treeRoot.children) {
		processToken(child, result);
		result.append('\n');
	}
	return result.toString().trim();
};