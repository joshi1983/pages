import { addInstructionsToProcedure } from './parsing/addInstructionsToProcedure.js';
import { addToken } from './parsing/addToken.js';
import { getDescendentsOfType } from
'../generic-parsing-utilities/getDescendentsOfType.js';
import { isComment } from './scanning/isComment.js';
import { ParseTreeToken } from '../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { scan } from './scanning/scan.js';
import { scanTokenToParseToken } from './scanTokenToParseToken.js';

export function parse(code) {
	const tokens = scan(code);
	const comments = [];
	const filteredTokens = [];
	for (const scanToken of tokens) {
		if (isComment(scanToken.s))
			comments.push(scanTokenToParseToken(scanToken));
		else
			filteredTokens.push(scanToken);
	}
	const result = new ParseTreeToken(null, 0, 0, ParseTreeTokenType.TREE_ROOT);
	let prev = result;
	for (let i = 0; i < filteredTokens.length; i++) {
		const pToken = scanTokenToParseToken(filteredTokens[i]);
		prev = addToken(prev, pToken);
	}
	const procStarts = getDescendentsOfType(result, ParseTreeTokenType.PROC_START);
	const labels = getDescendentsOfType(result, ParseTreeTokenType.LABEL_ANCHOR);
	const labelsMap = new Map();
	labels.forEach(label => labelsMap.set(label.val.toLowerCase(), label));
	for (const procStart of procStarts) {
		addInstructionsToProcedure(procStart, labelsMap);
	}
	return {
		'root': result,
		'comments': comments
	};
};