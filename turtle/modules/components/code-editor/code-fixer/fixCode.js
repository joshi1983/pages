import { allFixers } from './fixers/allFixers.js';
import { FixLogger } from './FixLogger.js';
import { getProceduresMap } from '../../../parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from '../../../parsing/LogoParser.js';
import { ParseLogger } from '../../../parsing/loggers/ParseLogger.js';
import { parseTreeToCodeWithComments } from '../../../parsing/parseTreeToCodeWithComments.js';
import { ParseTreeToken } from '../../../parsing/ParseTreeToken.js';
import { WriteOptimizedCachedParseTree } from '../../../parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';
await ParseTreeToken.asyncInit();

export function fixCode(code, fixLogger, proceduresMap, tree) {
	if (fixLogger instanceof ParseLogger)
		fixLogger = new FixLogger(fixLogger);
	else if (!(fixLogger instanceof FixLogger))
		throw new Error('fixLogger must be an instance of FixLogger or ParseLogger');
	if (!(proceduresMap instanceof Map))
		throw new Error('proceduresMap must be a Map');
	if (typeof code !== 'string')
		throw new Error('code must be a string.  Not: ' + code);
	if (tree !== undefined && !(tree instanceof ParseTreeToken))
		throw new Error('tree must either be undefined or be a ParseTreeToken.  Not: ' + tree);

	const parseLogger = new ParseLogger();
	if (tree === undefined)
		tree = LogoParser.getParseTree(code, parseLogger);
	if (parseLogger.hasLoggedErrors())
		return code; // the code is unfixable if it can't be parsed.
	else {
		// make sure any procedures defined in the code are scraped from tree 
		// and not whatever parse tree the caller used.
		// This is important for when the fixers try to change the parse tree tokens.
		const treeProceduresMap = getProceduresMap(tree);
		for (const [key, value] of treeProceduresMap) {
			proceduresMap.set(key, value);
		}
		const writableCachedParseTree = new WriteOptimizedCachedParseTree(tree, proceduresMap);
		for (let i = 0; i < allFixers.length; i++) {
			allFixers[i](writableCachedParseTree, fixLogger);
		}

		return parseTreeToCodeWithComments(tree, code);
	}
};