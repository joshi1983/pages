import { BufferedParseLogger } from '../../../parsing/loggers/BufferedParseLogger.js';
import { getProceduresMap } from '../../../parsing/parse-tree-analysis/getProceduresMap.js';
import { hasUnsafeErrorMessages } from './hasUnsafeErrorMessages.js';
import { LogoParser } from '../../../parsing/LogoParser.js';
import { parseTreeToCodeWithComments } from '../../../parsing/parseTreeToCodeWithComments.js';
import { WrappedFixLogger } from './WrappedFixLogger.js';
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
		const infiniteLoopCutoff = 5;
		for (let i = 0; i <= infiniteLoopCutoff; i++) {
			if (i === 4)
				console.log(`start watching. final fixing steps are starting.`);
			let wrappedFixLogger = new WrappedFixLogger(fixLogger);
			fix(writableCachedParseTree, wrappedFixLogger);
			if (wrappedFixLogger.hasLoggedAnything() === false) {
				break;
			}
			if (i === infiniteLoopCutoff) {
				console.log(`fix count reached ${infiniteLoopCutoff}.  This is a strong indicator of a bug in the fixers.
				Normally, all issues should be first in the first or second iteration.
				A hard-coded limit of ${infiniteLoopCutoff} is set to prevent such a bug from causing an infinite loop.`);
				console.error(`Check the call stack for this message to find out where the problem is coming from.`);
			}
		}

		return parseTreeToCodeWithComments(tree, code);
	}
};