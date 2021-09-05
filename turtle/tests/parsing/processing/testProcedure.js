import { analyzeCodeQuality } from
'../../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { getProceduresMap } from
'../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from
'../../../modules/parsing/LogoParser.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
import { TestParseLogger } from
'../../helpers/TestParseLogger.js';

function isLoggingMessage(msg) {
	if (msg.indexOf('Global variable color_mode_max_gray_value is assigned a value that is never read') === 0)
		return false;
	return true;
}

export function testProcedure(procName, content, logger) {
	const plogger = prefixWrapper(`Testing procedure ${procName}`, logger);
	const parseLogger = new TestParseLogger(plogger, content, undefined, isLoggingMessage);
	const tree = LogoParser.getParseTree(content, parseLogger, new Map());
	const initialVariablesMap = new Map();
	const proceduresMap = getProceduresMap(tree);
	analyzeCodeQuality(tree, parseLogger, proceduresMap, initialVariablesMap);
};