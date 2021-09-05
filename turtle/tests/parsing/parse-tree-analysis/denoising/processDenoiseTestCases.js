import { analyzeCodeQuality } from '../../../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { BufferedParseLogger } from '../../../../modules/parsing/loggers/BufferedParseLogger.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { noop } from '../../../../modules/noop.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function processDenoiseTestCases(cases, denoise, logger) {
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, noop);
		const initialVariablesMap = new Map();
		const proceduresMap = cachedParseTree.getProceduresMap();
		const parseLogger = new BufferedParseLogger();
		analyzeCodeQuality(cachedParseTree.root, parseLogger, proceduresMap, initialVariablesMap, true);
		const messages = parseLogger.getMessages();
		const beforeCount = messages.length;
		denoise(cachedParseTree, messages);
		const afterCount = messages.length;
		if (beforeCount - afterCount !== caseInfo.removeCount)
			plogger(`Expected to remove ${caseInfo.removeCount} but actually removed ${beforeCount - afterCount}`);
	});
};