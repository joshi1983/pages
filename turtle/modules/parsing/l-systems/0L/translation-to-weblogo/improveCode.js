import { FixLogger } from
'../../../../components/code-editor/code-fixer/FixLogger.js';
import { joinConsecutiveCommandCalls } from
'../../../../components/code-editor/code-fixer/fixers/helpers/joinConsecutiveCommandCalls.js';
import { ParseLogger } from
'../../../loggers/ParseLogger.js';
import { wrappedFix } from
'../../../../components/code-editor/code-fixer/wrappedFix.js';

export function improveCode(webLogoCode) {
	const parseLogger = new ParseLogger();
	const fixLogger = new FixLogger(parseLogger);
	const proceduresMap = new Map();
	return wrappedFix(webLogoCode, joinConsecutiveCommandCalls, fixLogger, proceduresMap);
};