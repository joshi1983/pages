import { analyzeCodeQuality } from
'../../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { dependencyMap, procsMap } from
'../../../modules/parsing/processing/translation-to-weblogo/includeAllReferencedProcedures.js';
import { getDescendentsOfType } from
'../../../modules/parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { getProceduresMap } from
'../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from
'../../../modules/parsing/LogoParser.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
import { Procedure } from
'../../../modules/parsing/Procedure.js';
import { TestParseLogger } from
'../../helpers/TestParseLogger.js';

function isLoggingMessage(msg) {
	if (msg.indexOf('Global variable color_mode_max_gray_value is assigned a value that is never read') === 0)
		return false;
	return true;
}

function includeDependentContentIfNeeded(content) {
	const parseLogger = new TestParseLogger(plogger, content, undefined, isLoggingMessage);
	let root;
	while (true) {
		root = LogoParser.getParseTree(content, parseLogger, new Map());
		const leafs = getDescendentsOfType(root, ParseTreeTokenType.LEAF).
			filter(leaf => !Procedure.isNameToken(leaf) && dependencyMap.has(leaf.val));
		if (leafs.length !== 0) {
			const prefix = new StringBuffer();
			const toAdd = new Set(leafs.map(leaf => leaf.val));
			for (const key of toAdd) {
				prefix.append(procsMap.get(key) + '\n\n');
			}
			content = prefix.toString() + content;
			tree = LogoParser.getParseTree(content, parseLogger, new Map());
		}
		else {
			break;
		}
	}
	return root;
}

export function testProcedure(procName, content, logger) {
	const plogger = prefixWrapper(`Testing procedure ${procName}`, logger);
	const tree = includeDependentContentIfNeeded(content);
	const initialVariablesMap = new Map();
	const proceduresMap = getProceduresMap(tree);
	analyzeCodeQuality(tree, parseLogger, proceduresMap, initialVariablesMap);
};