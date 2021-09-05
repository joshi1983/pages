import { FixLogger } from '../../../../../modules/components/code-editor/code-fixer/FixLogger.js';
import { forLoopVariableFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/forLoopVariableFixer.js';
import { LogoParser } from '../../../../../modules/parsing/LogoParser.js';
import { ParseTreeToken } from '../../../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../../modules/parsing/ParseTreeTokenType.js';
import { TestParseLogger } from '../../../../helpers/TestParseLogger.js';
import { WriteOptimizedCachedParseTree } from '../../../../../modules/parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';

export function testForLoopVariableFixer(logger) {
	const code = 'for [x 0 5 1] [print :x]';
	const parseLogger = new TestParseLogger(logger, code);
	const tree = LogoParser.getParseTree(code, parseLogger);
	const fixLogger = new FixLogger(parseLogger);
	const cachedParseTree = new WriteOptimizedCachedParseTree(tree, new Map());
	forLoopVariableFixer(cachedParseTree, fixLogger);
	const fixedToken = ParseTreeToken.flatten(tree).
		filter(t => t.val === 'x' && t.type === ParseTreeTokenType.STRING_LITERAL)[0];
	if (!(fixedToken instanceof ParseTreeToken))
		logger('Expected to find a string literal with value x after fixing the for-loop variable x in code: ' + code);
};