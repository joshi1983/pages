import { allFixers } from './fixers/allFixers.js';
import { FixLogger } from './FixLogger.js';
import { ParseLogger } from '../../../parsing/loggers/ParseLogger.js';
import { ParseTreeToken } from '../../../parsing/ParseTreeToken.js';
import { wrappedFix } from './wrappedFix.js';
import { WriteOptimizedCachedParseTree } from '../../../parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';
await ParseTreeToken.asyncInit();

function runAllFixers(cachedParseTree, fixLogger) {
	for (let i = 0; i < allFixers.length; i++) {
		allFixers[i](cachedParseTree, fixLogger);
	}
}

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

	return wrappedFix(code, runAllFixers, fixLogger, proceduresMap, tree);
};