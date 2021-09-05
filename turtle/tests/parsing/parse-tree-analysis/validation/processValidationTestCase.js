import { CachedParseTree } from '../../../../modules/parsing/parse-tree-analysis/CachedParseTree.js';
import { getProceduresMap } from '../../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from '../../../../modules/parsing/LogoParser.js';
import { noop } from '../../../helpers/noop.js';
import { ParseTreeToken } from '../../../../modules/parsing/ParseTreeToken.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../../helpers/TestParseLogger.js';

export function processValidationTestCase(caseInfo, logger, validateFunctionUnderTest) {
	const testLogger = new TestParseLogger(noop, caseInfo.code);
	const tree = LogoParser.getParseTree(caseInfo.code, testLogger);
	const plogger = caseInfo.index === undefined ? logger : prefixWrapper(`Case ${caseInfo.index}`, logger);
	if (!testLogger.hasLoggedErrors()) {
		const proceduresMap = getProceduresMap(tree);
		const initialVariablesMap = new Map();
		const parseTreeInfo = new CachedParseTree(tree, proceduresMap, initialVariablesMap);
		validateFunctionUnderTest(parseTreeInfo, testLogger, proceduresMap);
		if (testLogger.hasLoggedErrors() !== caseInfo.error)
			plogger('Expected to find error of ' + caseInfo.error + ' but got ' 
				+ testLogger.hasLoggedErrors() + ', code is: ' + caseInfo.code +
				', errors logged are ' + JSON.stringify(testLogger.getErrors()));
		if (typeof caseInfo.warn === 'boolean' && testLogger.hasLoggedWarnings() !== caseInfo.warn)
			plogger('Expected to find warning of ' + caseInfo.warn + ' but got ' +
				testLogger.hasLoggedWarnings() + ', code is: ' + caseInfo.code);
		if (typeof caseInfo.tip === 'boolean' && testLogger.hasLoggedTips() !== caseInfo.tip)
			plogger('Expected to find tip of ' + caseInfo.tip + ' but got ' +
				testLogger.hasLoggedTips() + ', code is: ' + caseInfo.code);
	}
	else if (caseInfo.parseFail !== true)
		plogger('Unexpectedly failed to parse before even getting to the validation stage.' +
			"code = " + caseInfo.code +
			"Errors logged are: " + JSON.stringify(testLogger.getErrors()));
}