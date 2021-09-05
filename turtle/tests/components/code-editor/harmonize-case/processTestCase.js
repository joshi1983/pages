import { getProceduresMap } from '../../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from '../../../../modules/parsing/LogoParser.js';
import { parseTreeToCodeWithComments } from '../../../../modules/parsing/parseTreeToCodeWithComments.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../../helpers/testParseLogger.js';
import { WriteOptimizedCachedParseTree } from '../../../../modules/parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';

export function processTestCase(caseInfo, functionUnderTest, logger) {
	if (typeof caseInfo !== 'object' || (caseInfo instanceof Array))
		throw new Error(`caseInfo must be an object.  Not: ${caseInfo}`);
	if (typeof caseInfo.code !== 'string')
		throw new Error(`caseInfo.code must be a string.  Not: ${caseInfo.code}`);
	if (typeof functionUnderTest !== 'function')
		throw new Error(`functionUnderTest must be a function.  Not: ${functionUnderTest}`);
	if (typeof logger !== 'function')
		throw new Error(`logger must be a function.  Not: ${logger}`);
	if (caseInfo.changed === false)
		caseInfo.to = caseInfo.code;

	if (Number.isInteger(caseInfo.index))
		logger = prefixWrapper(`Case ${caseInfo.index}`, logger);
	const parseLogger = new TestParseLogger(logger, caseInfo.code);
	const tree = LogoParser.getParseTree(caseInfo.code, parseLogger);
	const treeProceduresMap = getProceduresMap(tree);
	const writableCachedParseTree = new WriteOptimizedCachedParseTree(tree, treeProceduresMap);
	functionUnderTest(writableCachedParseTree);
	const result = parseTreeToCodeWithComments(tree, caseInfo.code);
	if (result !== caseInfo.to)
		logger(`Expected ${caseInfo.to} but got ${result}.`);
};