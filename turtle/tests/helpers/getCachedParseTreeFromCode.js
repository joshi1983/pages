import { CachedParseTree } from '../../modules/parsing/parse-tree-analysis/CachedParseTree.js';
import { getProceduresMap } from '../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { TestParseLogger } from './TestParseLogger.js';
await LogoParser.asyncInit();

export function getCachedParseTreeFromCode(code, logger) {
	const parseLogger = new TestParseLogger(logger, code);
	const tree = LogoParser.getParseTree(code, parseLogger);
	const proceduresMap = getProceduresMap(tree);
	return new CachedParseTree(tree, proceduresMap, new Map());
};