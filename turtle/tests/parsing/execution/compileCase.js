import { analyzeCodeQuality } from '../../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { getProceduresMap } from '../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from '../../../modules/parsing/LogoParser.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';

export function compileCase(caseInfo, index, logger) {
	if (typeof caseInfo.code !== 'string')
		throw new Error(`caseInfo.code expected to be a string but got ${caseInfo.code}`);
	if (!(caseInfo.messages instanceof Array))
		throw new Error(`caseInfo.messages expected to be an Array but got ${caseInfo.messages}`);
	const code = caseInfo.code;
	const plogger = prefixWrapper('Case ' + index, logger);
	const testLogger = new TestParseLogger(plogger, code, caseInfo.ignoreWarnings);
	const tree = LogoParser.getParseTree(code, testLogger);
	if (testLogger.hasLoggedErrors())
		logger('Unexpectedly logged errors while parsing ' + code + '.  Unable to compile or execute because of the failed parse.');
	else {
		const proceduresMap = getProceduresMap(tree);
		if (caseInfo.ignoreErrors === true)
			testLogger.doNotLogErrors();
		analyzeCodeQuality(tree, testLogger, proceduresMap, new Map());
		if (caseInfo.ignoreErrors !== true && testLogger.hasLoggedErrors())
			logger('Code quality analysis unexpectedly found quality problems with the parse tree so compilation and execution can not happen');
		else
			return {
				'plogger': plogger,
				'tree': tree,
				'testLogger': testLogger
			};
	}
};