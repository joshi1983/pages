import { BufferedParseLogger } from '../../../parsing/loggers/BufferedParseLogger.js';
import { getProceduresMap } from '../../../parsing/parse-tree-analysis/getProceduresMap.js';
import { hasUnsafeErrorMessages } from './hasUnsafeErrorMessages.js';
import { LogoParser } from '../../../parsing/LogoParser.js';
import { parseTreeToCodeWithComments } from '../../../parsing/parseTreeToCodeWithComments.js';
import { WriteOptimizedCachedParseTree } from '../../../parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';

export function wrappedFix(code, fix, fixLogger, proceduresMap, tree) {
	const parseLogger = new BufferedParseLogger();
	if (tree === undefined)
		tree = LogoParser.getParseTree(code, parseLogger);
	if (hasUnsafeErrorMessages(parseLogger))
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
		fix(writableCachedParseTree, fixLogger);

		return parseTreeToCodeWithComments(tree, code);
	}
};