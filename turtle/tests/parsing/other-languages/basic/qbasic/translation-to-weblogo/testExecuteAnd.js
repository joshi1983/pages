import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteAnd(logger) {
	const cases = [
		// tested at:
		// https://archive.org/details/msdos_qbasic_megapack
		{'code': 'print 1 and 1', 'messages': ['1']},
		{'code': 'print 1 and 2', 'messages': ['0']},
		{'code': 'print 3 and 2', 'messages': ['2']},
	];
	processTranslateExecuteCases(cases, logger);
};