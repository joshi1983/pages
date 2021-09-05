import { analyzeCodeQuality } from
'../../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { dependencyMap, procsMap } from
'../../../modules/parsing/processing/translation-to-weblogo/includeAllReferencedProcedures.js';
import { getProceduresMap } from
'../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from
'../../../modules/parsing/LogoParser.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
import { TestParseLogger } from
'../../helpers/TestParseLogger.js';

const messagePrefixesToNotLog = [
	'Global variable color_mode_max_gray_value is assigned a value that is never read'
];

function isLoggingMessage(msg) {
	if (messagePrefixesToNotLog.some(prefix => msg.indexOf(prefix) === 0))
		return false;
	return true;
}

function includeDependentContentIfNeeded(plogger, content) {
	const parseLogger = new TestParseLogger(plogger, content, undefined, isLoggingMessage);
	return LogoParser.getParseTree(content, parseLogger, new Map());
}

export function testProcedure(procName, logger) {
	const dependencies = dependencyMap.get(procName);
	let content = '';
	if (dependencies !== undefined) {
		for (const key of dependencies)
			content = procsMap.get(key) + '\n\n' + content;
	}
	const plogger = prefixWrapper(`Testing procedure ${procName}`, logger);
	const tree = includeDependentContentIfNeeded(plogger, content);
	const initialVariablesMap = new Map();
	const proceduresMap = getProceduresMap(tree);
	const parseLogger = new TestParseLogger(plogger, content, undefined, isLoggingMessage);
	analyzeCodeQuality(tree, parseLogger, proceduresMap, initialVariablesMap, {});
};