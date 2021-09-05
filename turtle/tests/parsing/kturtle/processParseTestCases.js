import { parse } from '../../../modules/parsing/kturtle/parse.js';
import { processParseTestCases as generalProcessParseTestCases } from '../../helpers/parsing/processParseTestCases.js';
import { ParseTreeTokenType } from '../../../modules/parsing/kturtle/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';
import { validateTokensByType } from '../../../modules/parsing/kturtle/parsing/parse-tree-analysis/validation/validateTokensByType.js';

export function processParseTestCases(cases, logger) {
	generalProcessParseTestCases(cases, parse, ParseTreeTokenType, logger);
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = parse(caseInfo.code);
		if (typeof result === 'object' && typeof result.root === 'object') {
			const parseLogger = new TestParseLogger(plogger, caseInfo.code);
			validateTokensByType(result.root, parseLogger);
		}
	});
};