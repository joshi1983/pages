import { fixBracketedParametersForColours } from
'./fixBracketedParametersForColours.js';
import { FixLogger } from
'../../FixLogger.js';
import { getProceduresMap } from
'../../../../../parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from
'../../../../../parsing/LogoParser.js';
import { ParseLogger } from
'../../../../../parsing/loggers/ParseLogger.js';
import { wrappedFix } from
'../../wrappedFix.js';
import { WriteOptimizedCachedParseTree } from
'../../../../../parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';

export function fixUsingParseTree(code) {
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(code, parseLogger);
	if (tree === undefined)
		return code;
	const proceduresMap = getProceduresMap(tree);
	const cTree = new WriteOptimizedCachedParseTree(tree, proceduresMap);
	const fixLogger = new FixLogger(parseLogger);
	code = wrappedFix(code, fixBracketedParametersForColours, fixLogger, proceduresMap, tree);
	return code;
};