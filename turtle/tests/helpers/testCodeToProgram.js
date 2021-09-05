import { analyzeCodeQuality } from '../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { compile } from '../../modules/parsing/compile.js';
import {  getProceduresMap } from '../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { TestParseLogger } from './TestParseLogger.js';
await LogoParser.asyncInit();

export function testCodeToProgram(code, logger, compileOptions, isAnalyzingCodeQuality) {
	if (typeof logger !== 'function')
		throw new Error('logger must be a function. Not ' + logger);
	if (isAnalyzingCodeQuality === undefined)
		isAnalyzingCodeQuality = true;
	if (typeof isAnalyzingCodeQuality !== 'boolean')
		throw new Error(`isAnalyzingCodeQuality must be boolean.  Not: ${isAnalyzingCodeQuality}`);
	if (compileOptions === undefined)
		compileOptions = {'translateToJavaScript': false};
	else if (typeof compileOptions !== 'object')
		throw new Error('compileOptions must either be undefined or an object.  Not: ' + compileOptions);
	const parseLogger = new TestParseLogger(logger, code);
	const tree = LogoParser.getParseTree(code, parseLogger);
	const proceduresMap = getProceduresMap(tree);
	if (isAnalyzingCodeQuality)
		analyzeCodeQuality(tree, parseLogger, proceduresMap, new Map(), true);
	if (parseLogger.hasLoggedErrors())
		logger('Parse errors unexpectedly found in code: ' + code);
	else
		return compile(code, tree, parseLogger, new Map(), compileOptions, new Map());
};
