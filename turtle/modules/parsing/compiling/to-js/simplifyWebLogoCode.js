import { FixLogger } from
'../../../components/code-editor/code-fixer/FixLogger.js';
import { ParseLogger } from
'../../loggers/ParseLogger.js';
import { runAllFixers } from
'../../../components/code-editor/code-fixer/runAllFixers.js';
import { simplifyAll } from
'../../../components/code-editor/code-fixer/fixers/helpers/simplifiers/simplifyAll.js';
import { simplifyWithLiterals } from
'../../../components/code-editor/code-fixer/fixers/helpers/simplifiers/simplifyWithLiterals.js';
import { simplifyWithRadians } from
'../../../components/code-editor/code-fixer/fixers/helpers/simplifiers/simplifyWithRadians.js';
import { substituteLocalConstants } from
'../../../components/code-editor/code-fixer/fixers/helpers/simplifiers/substituteLocalConstants.js';
import { wrappedFix } from
'../../../components/code-editor/code-fixer/wrappedFix.js';

export function simplifyWebLogoCode(code, options) {
	const logger = new ParseLogger();
	const fixLogger = new FixLogger(logger);
	const proceduresMap = new Map();
	const fixers = [simplifyAll];
	if (options.optimizeFor === 'performance') {
		fixers.push(substituteLocalConstants, simplifyWithRadians, simplifyWithLiterals);
	}
	return wrappedFix(code, runAllFixers(fixers), fixLogger, proceduresMap);
};