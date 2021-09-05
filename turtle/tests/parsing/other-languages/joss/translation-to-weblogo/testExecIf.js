import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecIf(logger) {
	const cases = [
		{'code': `Type "hi" if 1>0.`, 'messages': ['hi'], 'analyzeCodeQuality': false},
			// analyzeCodeQuality is false because we don't want to warn about the if condition always being true.
		{'code': `Type "hi" if 1<0.`, 'messages': [], 'analyzeCodeQuality': false},
	];
	processTranslateExecuteCases(cases, logger);
};