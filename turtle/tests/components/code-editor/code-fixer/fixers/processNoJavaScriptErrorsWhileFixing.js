import { LogoParser } from
'../../../../../modules/parsing/LogoParser.js';
import { ParseLogger } from
'../../../../../modules/parsing/loggers/ParseLogger.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { TestFixLogger } from
'../../../../helpers/TestFixLogger.js';
import { TestParseLogger } from
'../../../../helpers/TestParseLogger.js';
import { WriteOptimizedCachedParseTree } from
'../../../../../modules/parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';

export function processNoJavaScriptErrorsWhileFixing(examples, fixer, logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const parseLogger = new ParseLogger(plogger, code);
		const proceduresMap = new Map();
		const tree = LogoParser.getParseTree(code, parseLogger, proceduresMap);
		if (tree === undefined)
			plogger('Unable to parse the code: ' + code);
		else {
			const cachedParseTree = new WriteOptimizedCachedParseTree(tree, proceduresMap);
			const fixLogger = new TestFixLogger(parseLogger);
			fixer(cachedParseTree, fixLogger);
		}
	});
};