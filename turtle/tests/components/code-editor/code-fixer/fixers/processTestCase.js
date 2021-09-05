import { LogoParser } from '../../../../../modules/parsing/LogoParser.js';
import { parseTreeToCodeWithComments } from '../../../../../modules/parsing/parseTreeToCodeWithComments.js';
import { TestFixLogger } from '../../../../helpers/TestFixLogger.js';
import { TestParseLogger } from '../../../../helpers/TestParseLogger.js';
import { WriteOptimizedCachedParseTree } from '../../../../../modules/parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';

export function processTestCase(caseInfo, fixerFunction, logger) {
	const parseLogger = new TestParseLogger(logger, caseInfo.code);
	const tree = LogoParser.getParseTree(caseInfo.code, parseLogger);
	const fixLogger = new TestFixLogger(parseLogger);
	const proceduresMap = new Map();
	let treeArg = new WriteOptimizedCachedParseTree(tree, proceduresMap);
	fixerFunction(treeArg, fixLogger);
	const fixedCode = parseTreeToCodeWithComments(tree, caseInfo.code);
	if (fixedCode !== caseInfo.to)
		logger(`Fixed code expected to be "${caseInfo.to}" but got "${fixedCode}"`);
	if (caseInfo.logged !== fixLogger.hasLogged)
		logger(`Expected to log a message of ${caseInfo.logged} but got ${fixLogger.hasLogged}`);
};