import { CachedParseTree } from '../../../../modules/parsing/parse-tree-analysis/CachedParseTree.js';
import { LogoParser } from '../../../../modules/parsing/LogoParser.js';
import { ParseTreeToken } from '../../../../modules/parsing/ParseTreeToken.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../../helpers/TestParseLogger.js';

export function processTipsTestCase(caseInfo, tipsFunction, logger, index) {
	const proceduresMap = new Map();
	const parseLogger = new TestParseLogger(logger, caseInfo.code);
	const tree = LogoParser.getParseTree(caseInfo.code, parseLogger);
	tipsFunction(new CachedParseTree(tree, proceduresMap, new Map()), parseLogger);
	const tips = parseLogger.getTips();
	const plogger = prefixWrapper('Case ' + index + ' with code ' + caseInfo.code, logger);
	if (tips.length !== caseInfo.numTips)
		plogger('Expected ' + caseInfo.numTips + ' tips but got ' + tips.length + '.  The actual tips given are: ' + JSON.stringify(parseLogger.getTips()));

};