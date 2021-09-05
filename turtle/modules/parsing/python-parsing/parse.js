import { dtParseTokenToParseTreeToken } from './parse-tree-conversion/dtParseTokenToParseTreeToken.js';
import { indexToColRowIndex } from './parse-tree-conversion/indexToColRowIndex.js';
import { loadDTParser } from './loadDTParser.js';
import { ParseTreeToken } from './ParseTreeToken.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { restructureParseTree } from './parse-tree-conversion/tree-restructuring/restructureParseTree.js';
import { sanitizePythonCode } from './parse-tree-conversion/sanitizePythonCode.js';
let parsers = [];

export function asyncInit() {
	return loadDTParser();
};

function initParsers() {
	if (parsers.length === 0) {
		parsers.push(new Python2Parser());
		parsers.push(new Python3Parser());
	}
}

// Returns the parser that validates with the fewest messages.
function getBestParserForCode(code, parsers) {
	if (parsers.length === 1)
		return parsers[0];

	// determine which parser finds the code most valid.
	const validateResults = parsers.map(parser => parser.validate(code));
	let bestIndex = 0;
	for (let i = 1; i < parsers.length; i++) {
		if (validateResults[bestIndex].length >= validateResults[i].length) {
			bestIndex = i;
		}
	}
	return parsers[bestIndex];
}

// returns a python/ParseTreeToken.
// do not call until asyncInit resolves.
export function parse(code) {
	initParsers();
	code = sanitizePythonCode(code);
	let parser = getBestParserForCode(code, parsers);
	let dtParseToken = parser.parse(code);
	if (dtParseToken.exception !== undefined && dtParseToken.exception !== null) {
		/*
		An exception signals more trouble than validation messages so
		try parsing with another parser.
		*/
		parser = getBestParserForCode(code, parsers.filter(p => p !== parser));
		dtParseToken = parser.parse(code);
	}
	const result = dtParseTokenToParseTreeToken(dtParseToken, code, indexToColRowIndex(code));
	result.type = ParseTreeTokenType.TREE_ROOT;
	return restructureParseTree(result);
};