import { CachedParseTree } from '../../modules/parsing/parse-tree-analysis/CachedParseTree.js';
import { getProceduresMap } from '../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { ParseLogger } from '../../modules/parsing/loggers/ParseLogger.js';
import { TestParseLogger } from './TestParseLogger.js';
await LogoParser.asyncInit();

export function getCachedParseTreeFromCode(code, logger, logErrors) {
	if (typeof code !== 'string')
		throw new Error(`code must be a string.  Not: ${code}`);
	if (logErrors === undefined)
		logErrors = true;
	else if (typeof logErrors !== 'boolean')
		throw new Error(`logErrors must be a boolean but got ${logErrors}`);
	let parseLogger = new TestParseLogger(logger, code);
	if (logErrors === false)
		parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(code, parseLogger);
	if (tree === undefined) {
		const msg = `Unable to get parse tree for code ${code}`;
		logger(msg);
		throw new Error(msg);
	}
	const proceduresMap = getProceduresMap(tree);
	return new CachedParseTree(tree, proceduresMap, new Map());
};