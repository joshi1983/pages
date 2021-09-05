import { FixLogger } from
'../../../modules/components/code-editor/code-fixer/FixLogger.js';
import { formatCode } from
'../../../modules/components/code-editor/format/formatCode.js';
import { LogoParser } from
'../../../modules/parsing/LogoParser.js';
import { ParseLogger } from
'../../../modules/parsing/loggers/ParseLogger.js';
import { getProceduresMap } from
'../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { parseTreeToCodeWithComments } from
'../../../modules/parsing/parseTreeToCodeWithComments.js';
import { ready } from
'../../../modules/ready.js';
import { refreshLineNumbers } from '../../helpers/refreshLineNumbers.js';
import { simplifyAll } from
'../../../modules/components/code-editor/code-fixer/fixers/helpers/simplifiers/simplifyAll.js';
import { WriteOptimizedCachedParseTree } from
'../../../modules/parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';

let lineNumbersContainer, input, output;

function refreshLineNumbers_() {
	const code = input.value;
	refreshLineNumbers(lineNumbersContainer, code);
}

function refreshOutputs() {
	refreshLineNumbers_();
	const code = input.value;
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(code, parseLogger);
	if (tree !== undefined) {
		const fixLogger = new FixLogger(parseLogger);
		const procedures = getProceduresMap(tree);
		const wCachedParseTree = new WriteOptimizedCachedParseTree(tree, procedures);
		simplifyAll(wCachedParseTree, fixLogger);
		const translated = parseTreeToCodeWithComments(tree, code);
		output.innerText = translated;
	}
	else
		output.innerText = '; Failed to parse so could not simplify.';
}

function init() {
	input = document.getElementById('input');
	output = document.getElementById('simplified-output');
	lineNumbersContainer = document.getElementById('code-input-line-numbers');
	input.addEventListener('input', refreshOutputs);
	refreshOutputs();
}

ready(init);